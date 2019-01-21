import Topo from './components/topo/topo.vue';
const components = {
  Topo
};
const install = function(Vue, opts = {}) {
  Object.keys(components).forEach(key => {
    let name = 'i' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    console.log(name);
    Vue.component(name, components[key]);
  });
};
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue, { type: 'CDN' });
}
export default Object.assign(components, { install });
