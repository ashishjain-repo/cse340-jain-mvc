import { getClassifications } from '../models/index.js';
 
const getNav = async () => {
    const classifications = await getClassifications();
    let nav = '<nav><ul>';
    classifications.forEach((row) => {
        const id = row.classification_id;
        const name = row.classification_name;
        nav += `<li><a href="/category/${id}">${name}</a></li>`
    });
    return `${nav}</ul></nav>`;
};
 
export { getNav };