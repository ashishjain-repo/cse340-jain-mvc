import { getNav } from '../utils/index.js';
 
// Code omitted for brevity...
 
const configureNodeEnvironment = async (req, res, next) => {
    res.locals.navHTML = await getNav();
    // Code omitted for brevity...
};