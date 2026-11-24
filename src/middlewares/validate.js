const { validationError } = require('../utils/errors');

function formatZodIssues(issues) {
  return issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

function validate({ body, params, query } = {}) {
  return (req, res, next) => {
    const details = [];

    if (params) {
      const parsed = params.safeParse(req.params);
      if (!parsed.success) {
        details.push(...formatZodIssues(parsed.error.issues));
      } else {
        req.params = parsed.data;
      }
    }

    if (query) {
      const parsed = query.safeParse(req.query);
      if (!parsed.success) {
        details.push(...formatZodIssues(parsed.error.issues));
      } else {
        req.query = parsed.data;
      }
    }

    if (body) {
      const parsed = body.safeParse(req.body);
      if (!parsed.success) {
        details.push(...formatZodIssues(parsed.error.issues));
      } else {
        req.body = parsed.data;
      }
    }

    if (details.length > 0) {
      return next(validationError('Validation failed', details));
    }

    return next();
  };
}

module.exports = {
  validate,
};
