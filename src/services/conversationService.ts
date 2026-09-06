import { supabase } from './supabaseClient';

export const conversationService = {
  async add(params: { patientId: string; message: string; response: string; emotion: string; timestamp: string }) {
    const { data, error } = await supabase.from('conversations').insert({
      patient_id: params.patientId,
      message: params.message,
      response: params.response,
      emotion: params.emotion,
      timestamp: params.timestamp,
    });
    if (error) throw error;
    return data;
  },
  async getAll(patientId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('id, message, response, emotion, timestamp')
      .eq('patient_id', patientId)
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
  },
  async delete(id: number) {
    const { data, error } = await supabase.from('conversations').delete().eq('id', id);
    if (error) throw error;
    return data;
  },
};
