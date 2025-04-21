import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock implementation for testing Clarity contracts
const mockContract = () => {
  let admin = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  let completions = {};
  let currentBlockTime = 1000000; // Mock block time
  
  return {
    // Mock state
    getAdmin: () => admin,
    getCompletion: (employeeId, moduleId) => {
      const key = `${employeeId}-${moduleId}`;
      return completions[key];
    },
    
    // Mock block info
    getCurrentBlockTime: () => currentBlockTime,
    advanceBlockTime: (seconds) => {
      currentBlockTime += seconds;
    },
    
    // Mock contract functions
    recordCompletion: (sender, employeeId, moduleId, score, expirationDays) => {
      if (sender !== admin) return { error: 403 };
      
      const key = `${employeeId}-${moduleId}`;
      const expirationTime = currentBlockTime + (expirationDays * 86400);
      
      completions[key] = {
        completedAt: currentBlockTime,
        expiresAt: expirationTime,
        score: score
      };
      
      return { success: true };
    },
    
    isModuleCompleted: (employeeId, moduleId) => {
      const key = `${employeeId}-${moduleId}`;
      const completion = completions[key];
      
      if (!completion) return null;
      
      return currentBlockTime < completion.expiresAt;
    },
    
    getCompletionDetails: (employeeId, moduleId) => {
      const key = `${employeeId}-${moduleId}`;
      return completions[key];
    },
    
    setAdmin: (sender, newAdmin) => {
      if (sender !== admin) return { error: 403 };
      admin = newAdmin;
      return { success: true };
    }
  };
};

describe('Completion Tracking Contract', () => {
  let contract;
  
  beforeEach(() => {
    contract = mockContract();
  });
  
  it('should record a completed training module', () => {
    const admin = contract.getAdmin();
    const result = contract.recordCompletion(
        admin,
        'emp001',
        'safety101',
        95,
        365
    );
    
    expect(result.success).toBe(true);
    
    const completion = contract.getCompletion('emp001', 'safety101');
    expect(completion).toEqual({
      completedAt: contract.getCurrentBlockTime(),
      expiresAt: contract.getCurrentBlockTime() + (365 * 86400),
      score: 95
    });
  });
  
  it('should not allow non-admin to record completion', () => {
    const result = contract.recordCompletion(
        'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'emp002',
        'safety101',
        90,
        365
    );
    
    expect(result.error).toBe(403);
    expect(contract.getCompletion('emp002', 'safety101')).toBeUndefined();
  });
  
  it('should check if a module is completed and not expired', () => {
    const admin = contract.getAdmin();
    contract.recordCompletion(
        admin,
        'emp003',
        'safety101',
        85,
        30 // 30 days expiration
    );
    
    // Check immediately after completion
    expect(contract.isModuleCompleted('emp003', 'safety101')).toBe(true);
    
    // Advance time by 15 days (not expired yet)
    contract.advanceBlockTime(15 * 86400);
    expect(contract.isModuleCompleted('emp003', 'safety101')).toBe(true);
    
    // Advance time by another 20 days (now expired)
    contract.advanceBlockTime(20 * 86400);
    expect(contract.isModuleCompleted('emp003', 'safety101')).toBe(false);
  });
  
  it('should get completion details', () => {
    const admin = contract.getAdmin();
    contract.recordCompletion(
        admin,
        'emp004',
        'customer101',
        92,
        180
    );
    
    const details = contract.getCompletionDetails('emp004', 'customer101');
    expect(details).toEqual({
      completedAt: contract.getCurrentBlockTime(),
      expiresAt: contract.getCurrentBlockTime() + (180 * 86400),
      score: 92
    });
  });
});
