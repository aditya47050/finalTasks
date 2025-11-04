/**
 * Utility functions for handling family relationship mappings
 */

// Define reciprocal relationships
const RELATIONSHIP_MAPPING = {
  // Spouse relationships
  'Husband': 'Wife',
  'Wife': 'Husband',
  'Spouse': 'Spouse',
  
  // Parent-Child relationships
  'Father': 'Son', // Default to Son, but can be Daughter based on gender
  'Mother': 'Daughter', // Default to Daughter, but can be Son based on gender
  'Son': 'Father', // Default to Father, but can be Mother based on gender
  'Daughter': 'Mother', // Default to Mother, but can be Father based on gender
  
  // Sibling relationships
  'Brother': 'Brother', // Default to Brother, but can be Sister based on gender
  'Sister': 'Sister', // Default to Sister, but can be Brother based on gender
};

/**
 * Get the reciprocal relationship for a given relationship
 * @param {string} relation - The relationship to find reciprocal for
 * @param {string} gender - The gender of the person (optional, for more specific mapping)
 * @returns {string} - The reciprocal relationship
 */
export function getReciprocalRelationship(relation, gender = null) {
  if (!relation) return null;
  
  const baseReciprocal = RELATIONSHIP_MAPPING[relation];
  if (!baseReciprocal) return null;
  
  // Handle gender-specific mappings for parent-child relationships
  if (relation === 'Father' || relation === 'Mother') {
    return gender === 'Male' ? 'Son' : 'Daughter';
  }
  
  if (relation === 'Son' || relation === 'Daughter') {
    return gender === 'Male' ? 'Father' : 'Mother';
  }
  
  // Handle sibling relationships
  if (relation === 'Brother' || relation === 'Sister') {
    return gender === 'Male' ? 'Brother' : 'Sister';
  }
  
  return baseReciprocal;
}

/**
 * Get the reciprocal relationship considering the gender of the person
 * @param {string} relation - The relationship to find reciprocal for
 * @param {string} personGender - The gender of the person whose relationship we're setting
 * @returns {string} - The reciprocal relationship
 */
export function getReciprocalRelationshipWithGender(relation, personGender) {
  if (!relation) return null;
  
  // For spouse relationships, always return the opposite
  if (relation === 'Husband') return 'Wife';
  if (relation === 'Wife') return 'Husband';
  if (relation === 'Spouse') return 'Spouse';
  
  // For parent-child relationships, consider the person's gender
  if (relation === 'Father') {
    return personGender === 'Male' ? 'Son' : 'Daughter';
  }
  if (relation === 'Mother') {
    return personGender === 'Male' ? 'Son' : 'Daughter';
  }
  if (relation === 'Son') {
    return personGender === 'Male' ? 'Father' : 'Mother';
  }
  if (relation === 'Daughter') {
    return personGender === 'Male' ? 'Father' : 'Mother';
  }
  
  // For sibling relationships
  if (relation === 'Brother') {
    return personGender === 'Male' ? 'Brother' : 'Sister';
  }
  if (relation === 'Sister') {
    return personGender === 'Male' ? 'Brother' : 'Sister';
  }
  
  return null;
}

/**
 * Validate if a relationship is valid
 * @param {string} relation - The relationship to validate
 * @returns {boolean} - Whether the relationship is valid
 */
export function isValidRelationship(relation) {
  const validRelations = [
    'Father', 'Mother', 'Husband', 'Wife', 'Brother', 'Sister', 
    'Spouse', 'Son', 'Daughter'
  ];
  return validRelations.includes(relation);
}

/**
 * Get all available relationship options
 * @returns {Array} - Array of valid relationship options
 */
export function getAvailableRelationships() {
  return [
    'Father', 'Mother', 'Husband', 'Wife', 'Brother', 'Sister', 
    'Spouse', 'Son', 'Daughter'
  ];
}
