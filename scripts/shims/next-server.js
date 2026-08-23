class NextResponse {
  constructor(body, init = {}) {
    this._body = body;
    this.status = init.status || 200;
    this.headers = init.headers || {};
  }

  static json(data, init = {}) {
    return {
      status: init.status || 200,
      headers: init.headers || {},
      json: async () => data,
    };
  }
}

class NextRequest {
  constructor(url, init = {}) {
    this.url = url;
    this.method = init.method || 'GET';
    this._body = init.body;
  }

  async json() {
    return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
  }
}

module.exports = {
  NextResponse,
  NextRequest,
};
