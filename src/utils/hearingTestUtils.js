import { supabase } from '../supabaseClient';

export const saveHearingTestResult = async (testData) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('hearing_tests')
      .insert([{
        user_id: user.id,
        left_ear_results: testData.leftEar || null,
        right_ear_results: testData.rightEar || null,
        overall_score: testData.overallScore || null,
        test_type: testData.testType || 'audiometry'
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error saving hearing test:', error);
    return { success: false, error: error.message };
  }
};

export const getHearingTests = async (limit = 3) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('hearing_tests')
      .select('*')
      .eq('user_id', user.id)
      .order('test_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching hearing tests:', error);
    return { success: false, error: error.message };
  }
};