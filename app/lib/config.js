/*
 * Create and export configuration variables
 * 
 */


 // Container for all the ENV
 var environments = {};

 // Staging (default) env
 environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret' : 'thisIsASecret'
 };

 // Production env
 environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret' : 'thisIsAlsoASecret'
 };

 // Determine which env was passed as a command-line argument
 var currentEnviornment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

 // Check the current env is one of the env defined in this config file, if not, default to Staging
 var environmentToExport = typeof(environments[currentEnviornment]) == 'object' ? environments[currentEnviornment] : environments.staging;

// Export the module
module.exports = environmentToExport;
