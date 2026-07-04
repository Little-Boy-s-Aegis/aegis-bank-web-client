import apiClient from './apiClient';

export interface SecurityStatus {
  sqliEnabled: boolean;
  xssEnabled: boolean;
  idorEnabled: boolean;
  paramTamperingEnabled: boolean;
  bruteForceEnabled: boolean;
}

export interface SecurityLogItem {
  id: number;
  timestamp: string;
  attackType: string;
  endpoint: string;
  payload: string;
  status: string;
  clientIp: string;
  description: string;
}

export const getSecurityStatus = async (): Promise<SecurityStatus> => {
  const response = await apiClient.get<SecurityStatus>('/api/admin/security/status');
  return response.data;
};

export const toggleSecuritySetting = async (vulnerability: string, enabled: boolean): Promise<{ vulnerability: string; enabled: boolean }> => {
  const response = await apiClient.post('/api/admin/security/toggle', { vulnerability, enabled });
  return response.data;
};

export const getSecurityLogs = async (): Promise<SecurityLogItem[]> => {
  const response = await apiClient.get<SecurityLogItem[]>('/api/admin/security/logs');
  return response.data;
};

export const clearSecurityLogs = async (): Promise<{ message: string }> => {
  const response = await apiClient.post('/api/admin/security/logs/clear');
  return response.data;
};
