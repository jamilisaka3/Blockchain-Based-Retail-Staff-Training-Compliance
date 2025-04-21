import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock implementation for testing Clarity contracts
const mockContract = () => {
  let admin = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  let modules = {};
  
  return {
    // Mock state
    getAdmin: () => admin,
    getModule: (moduleId) => modules[moduleId],
    
    // Mock contract functions
    addTrainingModule: (sender, moduleId, title, description, required, durationMinutes, expirationDays) => {
      if (sender !== admin) return { error: 403 };
      if (modules[moduleId]) return { error: 100 };
      
      modules[moduleId] = {
        title,
        description,
        required,
        durationMinutes,
        expirationDays
      };
      return { success: true };
    },
    
    updateTrainingModule: (sender, moduleId, title, description, required, durationMinutes, expirationDays) => {
      if (sender !== admin) return { error: 403 };
      if (!modules[moduleId]) return { error: 404 };
      
      modules[moduleId] = {
        title,
        description,
        required,
        durationMinutes,
        expirationDays
      };
      return { success: true };
    },
    
    getTrainingModule: (moduleId) => {
      return modules[moduleId];
    },
    
    isModuleRequired: (moduleId) => {
      if (!modules[moduleId]) return null;
      return modules[moduleId].required;
    },
    
    setAdmin: (sender, newAdmin) => {
      if (sender !== admin) return { error: 403 };
      admin = newAdmin;
      return { success: true };
    }
  };
};

describe('Training Requirement Contract', () => {
  let contract;
  
  beforeEach(() => {
    contract = mockContract();
  });
  
  it('should add a new training module', () => {
    const admin = contract.getAdmin();
    const result = contract.addTrainingModule(
        admin,
        'safety101',
        'Basic Safety Training',
        'Essential safety procedures for all employees',
        true,
        60,
        365
    );
    
    expect(result.success).toBe(true);
    expect(contract.getModule('safety101')).toEqual({
      title: 'Basic Safety Training',
      description: 'Essential safety procedures for all employees',
      required: true,
      durationMinutes: 60,
      expirationDays: 365
    });
  });
  
  it('should not allow non-admin to add a module', () => {
    const result = contract.addTrainingModule(
        'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'security101',
        'Security Training',
        'Basic security protocols',
        true,
        45,
        180
    );
    
    expect(result.error).toBe(403);
    expect(contract.getModule('security101')).toBeUndefined();
  });
  
  it('should update an existing module', () => {
    const admin = contract.getAdmin();
    contract.addTrainingModule(
        admin,
        'customer101',
        'Customer Service',
        'Basic customer service training',
        true,
        30,
        180
    );
    
    const result = contract.updateTrainingModule(
        admin,
        'customer101',
        'Advanced Customer Service',
        'Comprehensive customer service training',
        true,
        60,
        365
    );
    
    expect(result.success).toBe(true);
    expect(contract.getModule('customer101')).toEqual({
      title: 'Advanced Customer Service',
      description: 'Comprehensive customer service training',
      required: true,
      durationMinutes: 60,
      expirationDays: 365
    });
  });
  
  it('should check if a module is required', () => {
    const admin = contract.getAdmin();
    contract.addTrainingModule(
        admin,
        'optional101',
        'Optional Training',
        'Non-mandatory training module',
        false,
        30,
        180
    );
    
    contract.addTrainingModule(
        admin,
        'required101',
        'Required Training',
        'Mandatory training module',
        true,
        45,
        365
    );
    
    expect(contract.isModuleRequired('optional101')).toBe(false);
    expect(contract.isModuleRequired('required101')).toBe(true);
  });
});
