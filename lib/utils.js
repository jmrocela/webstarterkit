/**
 * Format the output of process.hrtime
 *
 * @param hrTimeTuple
 * @returns {string}
 *
 * @author John Rocela <jamoy@hooq.tv>
 */
export const formatHrtime = (hrTimeTuple: []) => {
  return Number(process.hrtime(hrTimeTuple)[1] / 1000000).toFixed(2);
};
