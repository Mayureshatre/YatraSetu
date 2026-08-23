// Minimal zero-dependency runtime Zod implementation for test execution
class ZodType {
  constructor(validator) {
    this._validator = validator || ((v) => ({ success: true, data: v }));
  }

  parse(val) {
    const res = this.safeParse(val);
    if (!res.success) {
      const err = new Error(JSON.stringify(res.error));
      err.issues = res.error.issues;
      throw err;
    }
    return res.data;
  }

  safeParse(val) {
    return this._validator(val);
  }

  optional() {
    return new ZodType((val) => {
      if (val === undefined || val === null) return { success: true, data: val };
      return this._validator(val);
    });
  }

  default(defVal) {
    return new ZodType((val) => {
      if (val === undefined || val === null) return { success: true, data: defVal };
      return this._validator(val);
    });
  }
}

const z = {
  string: () => {
    let minL = 0;
    let maxL = Infinity;
    let rx = null;
    const type = new ZodType((val) => {
      if (typeof val !== 'string') return { success: false, error: { issues: [{ message: 'Expected string' }] } };
      if (val.length < minL) return { success: false, error: { issues: [{ message: `Too short (min ${minL})` }] } };
      if (val.length > maxL) return { success: false, error: { issues: [{ message: `Too long (max ${maxL})` }] } };
      if (rx && !rx.test(val)) return { success: false, error: { issues: [{ message: 'Regex mismatch' }] } };
      return { success: true, data: val };
    });
    type.min = (n) => { minL = n; return type; };
    type.max = (n) => { maxL = n; return type; };
    type.uuid = () => { minL = 10; return type; };
    type.regex = (r) => { rx = r; return type; };
    return type;
  },

  number: () => {
    let minV = -Infinity;
    let maxV = Infinity;
    let isInt = false;
    const type = new ZodType((val) => {
      if (typeof val !== 'number' || isNaN(val)) return { success: false, error: { issues: [{ message: 'Expected number' }] } };
      if (isInt && !Number.isInteger(val)) return { success: false, error: { issues: [{ message: 'Expected integer' }] } };
      if (val < minV) return { success: false, error: { issues: [{ message: `Must be >= ${minV}` }] } };
      if (val > maxV) return { success: false, error: { issues: [{ message: `Must be <= ${maxV}` }] } };
      return { success: true, data: val };
    });
    type.min = (n) => { minV = n; return type; };
    type.max = (n) => { maxV = n; return type; };
    type.int = () => { isInt = true; return type; };
    type.positive = () => { minV = 0.000001; return type; };
    return type;
  },

  coerce: {
    number: () => {
      let minV = -Infinity;
      let maxV = Infinity;
      const type = new ZodType((val) => {
        const n = Number(val);
        if (isNaN(n)) return { success: false, error: { issues: [{ message: 'Expected coerced number' }] } };
        if (n < minV || n > maxV) return { success: false, error: { issues: [{ message: 'Range error' }] } };
        return { success: true, data: n };
      });
      type.min = (n) => { minV = n; return type; };
      type.max = (n) => { maxV = n; return type; };
      type.default = (d) => new ZodType((val) => type.safeParse(val === undefined ? d : val));
      return type;
    },
  },

  literal: (lit) => new ZodType((val) => {
    if (val === lit) return { success: true, data: val };
    return { success: false, error: { issues: [{ message: `Expected literal ${lit}` }] } };
  }),

  union: (types) => new ZodType((val) => {
    for (const t of types) {
      const res = t.safeParse(val);
      if (res.success) return res;
    }
    return { success: false, error: { issues: [{ message: 'No union branch matched' }] } };
  }),

  boolean: () => new ZodType((val) => typeof val === 'boolean' ? { success: true, data: val } : { success: false, error: { issues: [{ message: 'Expected boolean' }] } }),

  enum: (vals) => {
    const type = new ZodType((val) => {
      if (vals.includes(val)) return { success: true, data: val };
      return { success: false, error: { issues: [{ message: `Expected one of ${vals.join(', ')}` }] } };
    });
    type.default = (d) => new ZodType((val) => type.safeParse(val === undefined ? d : val));
    return type;
  },

  array: (itemType) => new ZodType((val) => {
    if (!Array.isArray(val)) return { success: false, error: { issues: [{ message: 'Expected array' }] } };
    const resArr = [];
    for (const item of val) {
      const parsed = itemType.safeParse(item);
      if (!parsed.success) return parsed;
      resArr.push(parsed.data);
    }
    return { success: true, data: resArr };
  }),

  object: (shape) => new ZodType((val) => {
    if (!val || typeof val !== 'object' || Array.isArray(val)) {
      return { success: false, error: { issues: [{ message: 'Expected object' }] } };
    }
    const resObj = {};
    const issues = [];
    for (const [key, schema] of Object.entries(shape)) {
      const res = schema.safeParse(val[key]);
      if (!res.success) {
        issues.push({ field: key, ...res.error.issues[0] });
      } else {
        resObj[key] = res.data;
      }
    }
    if (issues.length > 0) {
      return {
        success: false,
        error: {
          issues,
          flatten: () => ({ fieldErrors: issues }),
        },
      };
    }
    return { success: true, data: { ...val, ...resObj } };
  }),
};

module.exports = { z };
