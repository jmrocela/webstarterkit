export default (ctx) => {
  return (body: object, status: number = 200) => {
    ctx.body = typeof body === 'object' ? body : null;
    ctx.type = 'application/json';
    ctx.status = typeof status === 'number' ? status : 200;

    // Removes the body when the statuses tells us to conform to the HTTP status specs.
    if (status === 201 || status === 204) {
      ctx.body = null;
    }
  };
};
