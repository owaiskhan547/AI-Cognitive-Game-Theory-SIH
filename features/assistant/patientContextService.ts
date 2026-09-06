import type { PatientContext } from './types';
import { mockPatientContext } from './mockPatientContext';

/**
 * Service for retrieving the current patient context.
 * Currently returns a mock patient context for development.
 */
export class PatientContextService {
  /**
   * Retrieves the current patient context.
   *
   * @returns A promise that resolves to a {@link PatientContext} object, or `null` if no context is available.
   */
  async getCurrentPatient(): Promise<PatientContext | null> {
    return mockPatientContext;
  }
}

export const patientContextService = new PatientContextService();
