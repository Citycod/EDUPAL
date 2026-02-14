import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Institution {
    id: string;
    name: string;
    location?: string;
    logo_url?: string;
}

export interface InstitutionContext {
    institution: Institution | null;
    loading: boolean;
    error: string | null;
}

/**
 * Hook to get the current user's institution context
 * This enforces university-based tenant isolation
 * 
 * @returns {InstitutionContext} The user's institution, loading state, and any errors
 */
export function useInstitutionContext(): InstitutionContext {
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUserInstitution() {
            try {
                setLoading(true);
                setError(null);

                // Get current user
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError) throw userError;
                if (!user) {
                    setError('Not authenticated');
                    setLoading(false);
                    return;
                }

                // Fetch user's profile to get institution ID
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('institution_id_permanent')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;

                if (!profile?.institution_id_permanent) {
                    setError('No institution assigned to user');
                    setLoading(false);
                    return;
                }

                // Fetch institution details from public view
                const { data: institutionData, error: instError } = await supabase
                    .from('hub_institutions')
                    .select('id, name, location, logo_url')
                    .eq('id', profile.institution_id_permanent)
                    .single();

                if (instError) throw instError;

                setInstitution(institutionData as Institution);
            } catch (err: any) {
                console.error('Error fetching institution context:', err);
                setError(err.message || 'Failed to load institution');
            } finally {
                setLoading(false);
            }
        }

        fetchUserInstitution();
    }, []);

    return { institution, loading, error };
}

/**
 * Get the current user's institution ID directly
 * Useful for queries that need to filter by institution
 * 
 * @returns {Promise<string | null>} The institution ID or null
 */
export async function getUserInstitutionId(): Promise<string | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile } = await supabase
            .from('profiles')
            .select('institution_id_permanent')
            .eq('id', user.id)
            .single();

        return profile?.institution_id_permanent || null;
    } catch (error) {
        console.error('Error getting institution ID:', error);
        return null;
    }
}
