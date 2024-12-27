const { createClient } = require('@supabase/supabase-js');

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbWhoa25jaGN5YXZheHRvamR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNjU5MTEsImV4cCI6MjA0OTk0MTkxMX0.0jNL_QikMs4cMTWBBhKWBS5okMG0mASHPFUig2zS6Jk'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase