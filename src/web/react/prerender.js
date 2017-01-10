export default function preRenderMiddleware(dispatch, components, params, extra = {}) {
  let needs = [];
  const checkObject = (objects, depth = 0) => {
    let keys = Object.keys(objects);

    if (depth < 3) {
      for (let key of keys) {
        if (typeof objects[key] === 'object') {
          checkObject(objects[key], depth + 1);
        } else if (typeof objects[key] === 'function') {
          if (objects[key].need) {
            needs = needs.concat(objects[key].need);
          }
        }
      }
    }
  };

  // this enables react-router to support ssr with the components prop in the route
  checkObject(components);
  return Promise.all(
    needs.map(need => dispatch(need(params, extra)))
  );
}
