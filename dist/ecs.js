var t=[],n=[],r={},e="_sign",o="_mask";"undefined"!=typeof Symbol&&(e=Symbol(e),o=Symbol(o));var i=function(t,n){var r=n[t];if(!r)throw new Error("The component is not registered");return r},s=i.bind(null,e),c=i.bind(null,o),a=function(n){n.id&&t.forEach(function(t){return t.match(n)})},h=1,u={},f=function(t){this.id=t||(h++).toString(36),this.components=Object.assign({},u),this.mask=0};f.prototype.add=function(){for(var t=this,n=[],r=arguments.length;r--;)n[r]=arguments[r];n.forEach(function(n){t.components[s(n.constructor)]=n,t.mask|=c(n.constructor)}),a(this)},f.prototype.remove=function(){for(var t=this,n=[],r=arguments.length;r--;)n[r]=arguments[r];n.forEach(function(n){var r=s(n),e=t.components[r];e&&(e.destructor&&e.destructor(),delete t.components[r],t.mask&=~c(n))}),a(this)},f.prototype.has=function(t){return s(t)in this.components},f.prototype.get=function(t){return this.components[t[e]]},f.prototype.eject=function(){var n;n=this,Object.keys(n.components).map(function(t){return n.components[t]}).forEach(function(t){return t&&t.destructor&&t.destructor()}),t.forEach(function(t){return t.remove(n)}),delete r[n.id],n.id=0};var p=function(t,n){this.entity=t,this.prev=null,this.next=n},m=function(t){var n=this;if(!t)throw new Error("Empty selector");this.mask=t,this.map={},this.list=null,this.length=0,Object.keys(r).map(function(t){return r[t]}).forEach(function(t){return n.match(t)})};m.prototype.iterate=function(t){for(var n=this.list;n;)t(n.entity),n=n.next},m.prototype.match=function(t){(this.mask&t.mask)===this.mask?this.add(t):this.remove(t)},m.prototype.add=function(t){if(!this.map[t.id]){var n=new p(t,this.list);this.list&&(this.list.prev=n),this.list=n,this.map[t.id]=n,this.length++}},m.prototype.remove=function(t){var n=this.map[t.id];n&&(n.prev?n.prev.next=n.next:this.list=n.next,n.next&&(n.next.prev=n.prev),delete this.map[t.id],this.length--)};var l=0,d=performance||Date,v=d.now.bind(d);module.exports={register:function(){for(var t=[],n=arguments.length;n--;)t[n]=arguments[n];t.forEach(function(t){if(l>31)throw new Error("Components limit reached");if(!t[e]){var n=l.toString(36);u[n]=null,t[e]=n,t[o]=1<<l,l++}})},process:function(){for(var t=[],r=arguments.length;r--;)t[r]=arguments[r];t.forEach(function(t){return n.push(t)})},create:function(t){var n=new f(t);if(r[n.id])throw new Error("The ID already exist");return r[n.id]=n,n},get:function(t){return r[t]},select:function(){for(var n=[],r=arguments.length;r--;)n[r]=arguments[r];var e=0;n.forEach(function(t){e|=c(t)});for(var o=0;o<t.length;o++)if(t[o].mask===e)return t[o];var i=new m(e);return t.push(i),i},update:function(t){var r={};return n.forEach(function(n){var e=v();n.update(t),r[n.constructor.name]=v()-e}),r}};
