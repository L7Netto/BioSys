if (window.supabaseClient) {
  console.log("Supabase já inicializado");
} else {
  const SUPABASE_URL = "https://slbnptqnrznptsxresjn.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsYm5wdHFucnpucHRzeHJlc2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MTYxMjIsImV4cCI6MjA5NDE5MjEyMn0.xDaGWL6SIPANW7etIlmdIAOetQwQkpcO1Dci2RDFQcg";

  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  window.supabase = window.supabaseClient;

  console.log("Supabase criado");
}