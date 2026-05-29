const validateLeadInput = (data, isUpdate = false) => {
  const errors = {};

  // Name required only on creation
  if (!isUpdate && (!data.name || data.name.trim() === '')) {
    errors.name = 'Lead name is required';
  }

  // Email validation (optional field)
  if (data.email && data.email.trim() !== '') {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please provide a valid email address';
    }
  }

  // Source validation (optional field)
  if (data.source) {
    const validSources = ['website', 'referral', 'cold_call', 'social_media', 'email', 'other'];
    if (!validSources.includes(data.source)) {
      errors.source = `Source must be one of: ${validSources.join(', ')}`;
    }
  }

  // Status validation (optional field)
  if (data.status) {
    const validStatuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
    if (!validStatuses.includes(data.status)) {
      errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
    }
  }

  // Follow-up date validation (optional field)
  if (data.followUpDate) {
    const parsedDate = Date.parse(data.followUpDate);
    if (isNaN(parsedDate)) {
      errors.followUpDate = 'Invalid follow-up date';
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = {
  validateLeadInput,
};
