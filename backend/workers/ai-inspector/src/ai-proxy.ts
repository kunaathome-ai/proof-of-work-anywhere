import { AIRequest, AIResponse, AIModelConfig } from '../../../../shared/types';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import OpenAI from 'openai';
import axios from 'axios';

const logger = createLogger('ai-proxy', LogLevel.INFO);

export class AIProxy {
  private models: Map<string, AIModelConfig>;
  private openaiClients: Map<string, OpenAI>;

  constructor() {
    this.models = new Map();
    this.openaiClients = new Map();
    this.initializeDefaultModels();
  }

  private initializeDefaultModels() {
    // Mock AI for local development
    this.models.set('mock', {
      id: 'mock',
      name: 'Mock AI',
      provider: 'local',
      type: 'multimodal',
      capabilities: ['text', 'vision', 'object_detection', 'ocr'],
      maxTokens: 4096
    });

    // Add OpenAI GPT-4o if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.models.set('gpt-4o', {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        type: 'multimodal',
        capabilities: ['text', 'vision'],
        maxTokens: 128000,
        costPerToken: 0.000005
      });
      this.openaiClients.set('openai', new OpenAI({ apiKey: process.env.OPENAI_API_KEY }));
    }

    // Add Azure OpenAI if configured
    if (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
      this.models.set('azure-gpt-4o', {
        id: 'azure-gpt-4o',
        name: 'Azure GPT-4o',
        provider: 'azure_openai',
        type: 'multimodal',
        capabilities: ['text', 'vision'],
        maxTokens: 128000,
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        apiKey: process.env.AZURE_OPENAI_API_KEY
      });
    }
  }

  registerModel(config: AIModelConfig) {
    this.models.set(config.id, config);
    
    if (config.provider === 'openai' && config.apiKey) {
      this.openaiClients.set(config.id, new OpenAI({ apiKey: config.apiKey }));
    }
    
    logger.info('AI model registered', { modelId: config.id, provider: config.provider });
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const modelConfig = this.models.get(request.model);

    if (!modelConfig) {
      throw new Error(`Model not found: ${request.model}`);
    }

    try {
      let response: AIResponse;

      switch (modelConfig.provider) {
        case 'openai':
          response = await this.processOpenAI(request, modelConfig);
          break;
        case 'azure_openai':
          response = await this.processAzureOpenAI(request, modelConfig);
          break;
        case 'local':
        case 'ollama':
          response = await this.processLocal(request, modelConfig);
          break;
        default:
          throw new Error(`Unsupported provider: ${modelConfig.provider}`);
      }

      response.latency = Date.now() - startTime;
      logger.info('AI request processed', { model: request.model, latency: response.latency });
      return response;
    } catch (error) {
      logger.error('AI request failed', { model: request.model, error });
      throw error;
    }
  }

  private async processOpenAI(request: AIRequest, config: AIModelConfig): Promise<AIResponse> {
    const client = this.openaiClients.get('openai');
    if (!client) throw new Error('OpenAI client not initialized');

    const messages: any[] = [];
    
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    
    messages.push({ role: 'user', content: request.prompt });

    if (request.image && config.capabilities.includes('vision')) {
      messages[0].content = [
        { type: 'text', text: request.prompt },
        { type: 'image_url', image_url: { url: request.image as string } }
      ];
    }

    const completion = await client.chat.completions.create({
      model: config.id,
      messages,
      max_tokens: request.maxTokens || config.maxTokens,
      temperature: request.temperature || 0.7,
      response_format: request.responseFormat === 'json' ? { type: 'json_object' } : undefined
    });

    const content = completion.choices[0].message.content || '';
    let structured: any;

    if (request.responseFormat === 'json') {
      try {
        structured = JSON.parse(content);
      } catch (e) {
        structured = { text: content };
      }
    }

    return {
      content,
      structured,
      model: config.id,
      tokensUsed: completion.usage?.total_tokens,
      latency: 0
    };
  }

  private async processAzureOpenAI(request: AIRequest, config: AIModelConfig): Promise<AIResponse> {
    // Similar to OpenAI but with Azure endpoint
    const client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: `${config.endpoint}/openai/deployments/${config.id}`
    });

    const messages: any[] = [
      { role: 'user', content: request.prompt }
    ];

    if (request.image) {
      messages[0].content = [
        { type: 'text', text: request.prompt },
        { type: 'image_url', image_url: { url: request.image as string } }
      ];
    }

    const completion = await client.chat.completions.create({
      model: config.id,
      messages,
      max_tokens: request.maxTokens || config.maxTokens,
      temperature: request.temperature || 0.7
    });

    const content = completion.choices[0].message.content || '';

    return {
      content,
      model: config.id,
      tokensUsed: completion.usage?.total_tokens,
      latency: 0
    };
  }

  private async processLocal(request: AIRequest, config: AIModelConfig): Promise<AIResponse> {
    // Mock AI for local development
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockResponse = this.generateMockResponse(request, config);
    
    return {
      content: JSON.stringify(mockResponse),
      structured: mockResponse,
      model: config.id,
      tokensUsed: 100,
      latency: 0
    };
  }

  private generateMockResponse(request: AIRequest, config: AIModelConfig): any {
    if (config.capabilities.includes('vision') && request.image) {
      return {
        labels: [
          { label: 'construction_site', confidence: 0.95 },
          { label: 'worker', confidence: 0.88 },
          { label: 'safety_equipment', confidence: 0.92 }
        ],
        objects: [
          { name: 'person', boundingBox: [100, 150, 200, 300], confidence: 0.91 },
          { name: 'hard_hat', boundingBox: [120, 160, 180, 200], confidence: 0.87 }
        ],
        ocr: [],
        description: 'Image shows a construction site with workers wearing safety equipment',
        confidence: 0.91
      };
    }

    return {
      analysis: 'Task completed successfully according to requirements',
      confidence: 0.85,
      findings: [
        'All required photos captured',
        'GPS location within acceptable range',
        'Checklist items completed'
      ],
      recommendations: []
    };
  }

  generateSystemPrompt(jobTemplate: any, workerInstructions?: string): string {
    let prompt = `You are an AI inspector for proof of work validation. `;
    
    if (jobTemplate.description) {
      prompt += `Job description: ${jobTemplate.description}. `;
    }
    
    if (jobTemplate.aiPromptTemplate) {
      prompt += jobTemplate.aiPromptTemplate;
    }
    
    if (workerInstructions) {
      prompt += ` Worker instructions: ${workerInstructions}`;
    }
    
    prompt += ` Analyze the provided evidence and return structured JSON with labels, confidence scores, and detailed findings.`;
    
    return prompt;
  }

  getAvailableModels(): AIModelConfig[] {
    return Array.from(this.models.values());
  }

  getModel(modelId: string): AIModelConfig | undefined {
    return this.models.get(modelId);
  }
}
