import axios from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:3001';

describe('Job API Integration Tests', () => {
  let jobId: string;

  describe('POST /api/jobs', () => {
    it('should create a new job', async () => {
      const jobData = {
        clientId: 'test-client',
        title: 'Integration Test Job',
        description: 'Test job for integration testing',
        requiredPhotos: 3,
        checklist: [
          { id: '1', text: 'Check safety equipment', type: 'boolean', required: true, order: 1 }
        ],
        status: 'active'
      };

      const response = await axios.post(`${BASE_URL}/api/jobs`, jobData);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe(jobData.title);
      
      jobId = response.data.id;
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should retrieve a job by ID', async () => {
      const response = await axios.get(`${BASE_URL}/api/jobs/${jobId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(jobId);
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('checklist');
    });
  });

  describe('GET /api/jobs/client/:clientId', () => {
    it('should retrieve jobs by client ID', async () => {
      const response = await axios.get(`${BASE_URL}/api/jobs/client/test-client`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/jobs/:id', () => {
    it('should update a job', async () => {
      const updateData = {
        title: 'Updated Test Job'
      };

      const response = await axios.put(`${BASE_URL}/api/jobs/${jobId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.title).toBe(updateData.title);
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('should delete a job', async () => {
      const response = await axios.delete(`${BASE_URL}/api/jobs/${jobId}`);
      
      expect(response.status).toBe(204);
    });
  });
});
