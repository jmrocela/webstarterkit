export default function preRenderMiddleware(dispatch, components, params, extra = {}) {
  let needs = [];
  function checkObject(components, depth = 0) {
    let keys = Object.keys(components);

    if (depth < 3) {
      for (let key of keys) {
        if (typeof components[key] === 'object') {
          checkObject(components[key], depth + 1);
        } else if (typeof components[key] === 'function') {
          if (components[key].need) {
            needs = needs.concat(components[key].need);
          }
        }
      }
    }
  }
  // this enables react-router to support ssr with the components prop in the route
  checkObject(components);
  return Promise.all(
    needs.map(need => dispatch(need(params, extra)))
  );
}