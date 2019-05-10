var t=function(t,n){this.c=t,this.p=null,this.n=n,this.d=0;};t.prototype.r=function(){this.d=1;};var n=function(){this.h=null;};n.prototype.add=function(n){var e=new t(n,this.h);return this.h&&(this.h.p=e),this.h=e,e},n.prototype.i=function(t){for(var n=this.h;n;)n.d?(n.p?n.p.n=n.n:this.h=n.n,n.n&&(n.n.p=n.p)):t(n.c),n=n.n;};var e=6408,r=5121,i=3553,a=9728,o=33071,u=function(t){this.z=t,this.o=new n,this.t=new n;};u.prototype.add=function(t){t.remove(),t.layer=this,t.n=(function(t){return 1!==t.a||0===t.frame.alphaTest}(t)?this.t:this.o).add(t);};var h=function(t,n){var e=t.getContext("webgl",Object.assign({antialias:!1,alpha:!1},n)),a=e.getExtension("ANGLE_instanced_arrays"),o=function(t,n){var r=e.createShader(n);return e.shaderSource(r,t),e.compileShader(r),r},c=function(t,n,r){var i=e.createBuffer();return e.bindBuffer(t,i),e.bufferData(t,n,r||35044),i},s=[],f={gl:e,camera:{at:h.Point(),to:h.Point(),angle:0},background:function(t,n,r){e.clearColor(t,n,r,1);},layer:function(t){var n=s.find(function(n){return n.z===t});return n||(n=new u(t),s.push(n),s.sort(function(t,n){return n.z-t.z})),n}},l=f.layer(0);f.add=function(t){l.add(t);};var v=function(t,n){var r=o(t,35633),i=o(n,35632),a=e.createProgram();return e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),a}("attribute vec2 g;\nattribute vec2 a;\nattribute vec2 t;\nattribute float r;\nattribute vec2 s;\nattribute vec4 u;\nattribute vec4 c;\nattribute float z;\nuniform mat4 m;\nvarying vec2 v;\nvarying vec4 i;\nvoid main(){\nv=u.xy+g*u.zw;\ni=c.abgr;\nvec2 p=(g-a)*s;\nfloat q=cos(r);\nfloat w=sin(r);\np=vec2(p.x*q-p.y*w,p.x*w+p.y*q);\np+=a+t;\ngl_Position=m*vec4(p,z,1);}","precision mediump float;\nuniform sampler2D x;\nuniform float j;\nvarying vec2 v;\nvarying vec4 i;\nvoid main(){\nvec4 c=texture2D(x,v);\ngl_FragColor=c*i;\nif(j>0.0){\nif(c.a<j)discard;\ngl_FragColor.a=1.0;};}"),p=function(t,n,r,i,o,u,h){var c=e.getAttribLocation(v,t);return e.enableVertexAttribArray(c),e.vertexAttribPointer(c,n,u||5126,!!h,r||0,o||0),i&&a.vertexAttribDivisorANGLE(c,i),c};c(34963,new Uint8Array([0,1,2,2,1,3])),c(34962,new Float32Array([0,0,0,1,1,0,1,1])),p("g",2);var d=new ArrayBuffer(3407820),g=new Float32Array(d),y=new Uint32Array(d);c(34962,d,35048),p("a",2,52,1),p("s",2,52,1,8),p("r",1,52,1,16),p("t",2,52,1,20),p("u",4,52,1,28),p("c",4,52,1,44,r,!0),p("z",1,52,1,48);var x,b,m=function(t){return e.getUniformLocation(v,t)},w=m("m"),P=m("x"),A=m("j"),j=0,T=function(){j&&(e.bufferSubData(34962,0,g.subarray(0,13*j)),a.drawElementsInstancedANGLE(4,6,r,0,j),j=0);},z=function(t){if(t.visible){65535===j&&T();var n=t.frame,r=t.scale,a=t.position,o=n.tex,u=n.uvs,h=t.anchor||n.anchor;x!==o&&(T(),x=o,e.bindTexture(i,o),e.uniform1i(P,o),e.uniform1f(A,b?n.alphaTest:0));var c=13*j;g[c++]=h.x,g[c++]=h.y,g[c++]=r.x*n.width,g[c++]=r.y*n.height,g[c++]=t.rotation,g[c++]=a.x,g[c++]=a.y,g[c++]=u[0],g[c++]=u[1],g[c++]=u[2],g[c++]=u[3],y[c++]=((16777215&t.tint)<<8|255*t.a&255)>>>0,g[c++]=-t.layer.z,j++;}};return f.render=function(){var n=t.clientWidth,r=t.clientHeight;t.width=n,t.height=r;var i=f.camera,a=i.at,o=i.to,u=i.angle,h=a.x-n*o.x,c=a.y-r*o.y,l=Math.cos(u),p=Math.sin(u),d=2/n,g=-2/r,y=[l*d,p*g,0,0,-p*d,l*g,0,0,0,0,1e-5,0,(a.x*(1-l)+a.y*p)*d-2*h/n-1,(a.y*(1-l)-a.x*p)*g+2*c/r+1,0,1];e.useProgram(v),e.uniformMatrix4fv(w,!1,y),e.viewport(0,0,n,r),e.clear(16640),e.activeTexture(33984),x=null,e.disable(3042),e.enable(2929),e.depthFunc(513),b=!0,s.forEach(function(t){t.o.i(function(t){return z(t)});}),T(),e.enable(3042),e.blendFunc(770,771),e.depthFunc(515),e.uniform1f(A,0),b=!1;for(var m=s.length;m>0;m--)s[m-1].t.i(function(t){return z(t)});T();},f.render(),f};h.Point=function(){function t(t,n){if(!(this instanceof h.Point))return new h.Point(t,n);this.set(t,n);}return t.prototype.set=function(t,n){return this.x=t||0,this.y=n||(0!==n?this.x:0),this},t.prototype.clone=function(){return h.Point(this.x,this.y)},t}(),h.Frame=function(){function t(n,e,r,i){if(!(this instanceof t))return new t(n,e,r,i);this.texture=n,this.width=r.x,this.height=r.y,this.uvs=[e.x/n.width,e.y/n.height,r.x/n.width,r.y/n.height],this.anchor=i||n.anchor.clone();}var n={alphaTest:{configurable:!0},tex:{configurable:!0}};return n.alphaTest.get=function(){return this.texture.a},n.tex.get=function(){return this.texture.tex},Object.defineProperties(t.prototype,n),t}(),h.Texture=function(){function t(n,u,c,s){if(!(this instanceof t))return new t(n,u,c,s);var f=n.gl,l=Object.assign({10240:a,10241:a,10242:o,10243:o},s);this.tex=f.createTexture(),f.bindTexture(i,this.tex),Object.keys(l).forEach(function(t){return f.texParameteri(i,t,l[t])}),f.texImage2D(i,0,e,e,r,u),this.anchor=h.Point(),this.a=c||(0===c?0:1),this.width=u.width,this.height=u.height,this.uvs=[0,0,1,1];}var n={alphaTest:{configurable:!0}};return n.alphaTest.get=function(){return this.a},Object.defineProperties(t.prototype,n),t}(),h.Sprite=function(){function t(n,e){if(!(this instanceof t))return new t(n,e);this.frame=n,this.a=1,Object.assign(this,{visible:!0,position:h.Point(),scale:h.Point(1),rotation:0,tint:16777215,anchor:null},e),this.remove();}var n={alpha:{configurable:!0}};return n.alpha.get=function(){return this.a},n.alpha.set=function(t){var n=this.a;this.a=t,this.n&&(t<1&&1===n||1===t&&n<1)&&this.layer.add(this);},t.prototype.remove=function(){this.n&&this.n.r(),this.layer=null,this.n=null;},Object.defineProperties(t.prototype,n),t}();

var Vector = function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

Vector.prototype.from = function from (obj) {
  this.x = obj.x;
  this.y = obj.y;
  return this;
};

Vector.prototype.add = function add (vec) {
  this.x += vec.x;
  this.y += vec.y;
  return this;
};

Vector.prototype.sub = function sub (vec) {
  this.x -= vec.x;
  this.y -= vec.y;
  return this;
};

Vector.prototype.invert = function invert () {
  this.x *= -1;
  this.y *= -1;
  return this;
};

Vector.prototype.mul = function mul (scalar) {
  this.x *= scalar;
  this.y *= scalar;
  return this;
};
/*
mulVec(vec) {
  this.x *= vec.x;
  this.y *= vec.y;
  return this;
}
*/


Vector.prototype.div = function div (scalar) {
  if (scalar === 0) {
    this.x = 0;
    this.y = 0;
  } else {
    this.x /= scalar;
    this.y /= scalar;
  }

  return this;
};
/*
divVec(vec) {
  this.x /= vec.x;
  this.y /= vec.y;
  return this;
}
*/


Vector.prototype.norm = function norm () {
  var length = this.length();

  if (length === 0) {
    this.x = 1;
    this.y = 0;
  } else {
    this.div(length);
  }

  return this;
};

Vector.prototype.rotate = function rotate (angle) {
  var nx = this.x * Math.cos(angle) - this.y * Math.sin(angle);
  var ny = this.x * Math.sin(angle) + this.y * Math.cos(angle);
  this.x = nx;
  this.y = ny;
  return this;
};

Vector.prototype.lengthSq = function lengthSq () {
  return this.x * this.x + this.y * this.y;
};

Vector.prototype.length = function length () {
  return Math.sqrt(this.lengthSq());
};

Vector.prototype.distanceSq = function distanceSq (vec) {
  var dx = this.x - vec.x;
  var dy = this.y - vec.y;
  return dx * dx + dy * dy;
};

Vector.prototype.distance = function distance (vec) {
  return Math.sqrt(this.distanceSq(vec));
};

Vector.prototype.angle = function angle () {
  return Math.atan2(this.y, this.x);
};

Vector.prototype.cross = function cross (vec) {
  return this.x * vec.y - this.y * vec.x;
};

Vector.prototype.dot = function dot (vec) {
  return this.x * vec.x + this.y * vec.y;
};

Vector.prototype.clone = function clone () {
  return new Vector(this.x, this.y);
};

// eslint-disable-next-line import/no-extraneous-dependencies

var VectorWithRotation = /*@__PURE__*/(function (Vector$$1) {
  function VectorWithRotation(x, y, rotation) {
    Vector$$1.call(this, x, y);
    this.rotation = rotation || 0;
  }

  if ( Vector$$1 ) VectorWithRotation.__proto__ = Vector$$1;
  VectorWithRotation.prototype = Object.create( Vector$$1 && Vector$$1.prototype );
  VectorWithRotation.prototype.constructor = VectorWithRotation;

  return VectorWithRotation;
}(Vector));

var Position = /*@__PURE__*/(function (VectorWithRotation) {
  function Position () {
    VectorWithRotation.apply(this, arguments);
  }if ( VectorWithRotation ) Position.__proto__ = VectorWithRotation;
  Position.prototype = Object.create( VectorWithRotation && VectorWithRotation.prototype );
  Position.prototype.constructor = Position;

  

  return Position;
}(VectorWithRotation));
var Velocity = /*@__PURE__*/(function (VectorWithRotation) {
  function Velocity () {
    VectorWithRotation.apply(this, arguments);
  }if ( VectorWithRotation ) Velocity.__proto__ = VectorWithRotation;
  Velocity.prototype = Object.create( VectorWithRotation && VectorWithRotation.prototype );
  Velocity.prototype.constructor = Velocity;

  

  return Velocity;
}(VectorWithRotation));
var Sprite = /*@__PURE__*/(function (superclass) {
  function Sprite () {
    superclass.apply(this, arguments);
  }

  if ( superclass ) Sprite.__proto__ = superclass;
  Sprite.prototype = Object.create( superclass && superclass.prototype );
  Sprite.prototype.constructor = Sprite;

  Sprite.prototype.destructor = function destructor () {
    this.remove();
  };

  return Sprite;
}(h.Sprite));
var Transform = function Transform(transformer) {
  this.transformer = transformer;
  this.remaining = transformer.duration;
};
var Bounty = function Bounty () {};
var Hunter = function Hunter() {
  this.target = null;
  this.distance = null;
  this.speed = 250 * (1 + Math.random() / 4);
  this.agi = Math.PI / 48 * (1 + Math.random() / 4);
  this.color = 0xffffff * Math.random();
};

/*
const x0 = 1;
const y0 = 0;
const cos = Math.cos(angle);
const sin = Math.sin(angle);
const x = x0 * cos - y0 * sin;
const y = x0 * sin + y0 * cos;
return new Vector(x, y);
*/

var vecFromAngle = function (angle) { return new Vector(Math.cos(angle), Math.sin(angle)); };
var signRandom = function (scale) {
	if ( scale === void 0 ) scale = 1;

	return (Math.random() - 0.5) * scale;
};

var Movement = function Movement(ecs) {
  this.selector = ecs.select(Position, Velocity);
};

Movement.prototype.update = function update (delta) {
  this.selector.iterate(function (entity) {
    var position = entity.get(Position);
    var velocity = entity.get(Velocity);
    position.add(velocity.clone().mul(delta));
    position.rotation += velocity.rotation * delta;
  });
};
var exhaustTransform = {
  // duration: 1 / 2,
  duration: 1,

  end: function end(entity) {
    entity.eject();
  },

  update: function update(entity, stage) {
    var sprite = entity.get(Sprite);
    sprite && (sprite.alpha = stage);
  }

};
var exhaustParticleProps = {
  tint: 0xfbf98c
};
var Exhaust = function Exhaust(ecs, frame, layer) {
  this.ecs = ecs;
  this.frame = frame;
  this.layer = layer;
  this.selector = ecs.select(Hunter, Position);
};

Exhaust.prototype.update = function update () {
    var this$1 = this;

  this.selector.iterate(function (entity) {
    var position = entity.get(Position);
    var direction = vecFromAngle(position.rotation + Math.PI * signRandom());
    var offset = vecFromAngle(position.rotation).mul(8);
    var sprite = new Sprite(this$1.frame, exhaustParticleProps);
    this$1.layer.add(sprite);
    this$1.ecs.create().add(new Position().from(position).sub(offset), new Velocity().from(direction).mul(Math.random() * 20), sprite, new Transform(exhaustTransform));
  });
};
var Transformer = function Transformer(ecs) {
  this.selector = ecs.select(Transform);
};

Transformer.prototype.update = function update (delta) {
  this.selector.iterate(function (entity) {
    var transform = entity.get(Transform);
    transform.remaining -= delta;

    if (transform.remaining <= 0) {
      transform.transformer.end && transform.transformer.end(entity);
      transform.transformer = transform.transformer.next;

      if (!transform.transformer) {
        entity.remove(Transform);
        return;
      }

      transform.remaining += transform.transformer.duration;
    }

    transform.transformer.update && transform.transformer.update(entity, transform.remaining / transform.transformer.duration);
  });
};
var AI = function AI(ecs, particleFrame, particleLayer) {
  this.ecs = ecs;
  this.hunters = ecs.select(Hunter);
  this.bounties = ecs.select(Bounty);
  this.hunterTransform = {
    duration: 1 / 6,

    update: function update(entity, stage) {
      var sprite = entity.get(Sprite);
      var scale = 1 + (1 - stage) * 0.2;
      sprite && sprite.scale.set(scale);
    },

    next: {
      duration: 1 / 4,

      update: function update(entity, stage) {
        var sprite = entity.get(Sprite);
        var scale = 1.2 - (1 - stage) * 0.2;
        sprite && sprite.scale.set(scale);
      },

      end: function end(entity) {
        var sprite = entity.get(Sprite);
        sprite && sprite.scale.set(1);
      }

    }
  };
  var deathParticleProps = {
    tint: 0xf26419
  };
  this.deathTransform = {
    duration: 1 / 4,

    end: function end(entity) {
      var position = entity.get(Position);

      if (position) {
        for (var angle = 0; angle < Math.PI * 2; angle += Math.PI / 10) {
          var velocity = vecFromAngle(angle).mul(100 * (1 + Math.random()));
          var sprite = new Sprite(particleFrame, deathParticleProps);
          particleLayer.add(sprite);
          ecs.create().add(new Position().from(position), new Velocity().from(velocity), sprite, new Transform(exhaustTransform));
        }
      }

      entity.eject();
    },

    update: function update(entity, stage) {
      var sprite = entity.get(Sprite);
      sprite && sprite.scale.set(stage);
    }

  };
};

AI.prototype.update = function update (delta) {
    var this$1 = this;

  this.hunters.iterate(function (entity) {
    var hunter = entity.get(Hunter);

    if (hunter.distance && hunter.distance < 28 * 28) {
      var bounty = hunter.target;

      if (bounty.has(Bounty)) {
        bounty.remove(Bounty);
        bounty.add(new Transform(this$1.deathTransform));
        entity.add(new Transform(this$1.hunterTransform));
      }
    }

    hunter.target = null;
    hunter.distance = null;
  });
  this.bounties.iterate(function (bounty) {
    var bountyPosition = bounty.get(Position);
    this$1.hunters.iterate(function (entity) {
      var hunter = entity.get(Hunter);
      var hunterPosition = entity.get(Position);
      var distance = hunterPosition.distanceSq(bountyPosition);

      if (hunter.distance === null || hunter.distance > distance) {
        hunter.distance = distance;
        hunter.target = bounty;
      }
    });
  });
  this.hunters.iterate(function (hunter) {
    var hunterPosition = hunter.get(Position);
    var ref = hunter.get(Hunter);
      var target = ref.target;
      var speed = ref.speed;
      var agi = ref.agi;
    var velocity = hunter.get(Velocity);

    if (target) {
      var bountyPosition = target.get(Position);
      var s = bountyPosition.clone().sub(hunterPosition).norm();
      var direction = vecFromAngle(hunterPosition.rotation);
      var angle = Math.atan2(direction.cross(s), direction.dot(s));

      if (Math.abs(angle) > agi) {
        var sign = angle < 0 ? -1 : 1;
        angle = agi * sign;
      }

      velocity.from(direction).mul(speed);
      velocity.rotation = angle / delta;
    } else {
      velocity.x = 0;
      velocity.y = 0;
      velocity.rotation = 0;
    }
  });
};
var Spawner = function Spawner(ecs, scene, amount, frame) {
  this.ecs = ecs;
  this.amount = amount;
  this.frame = frame;
  this.canvas = scene.gl.canvas;
  this.layer = scene.layer(2);
  this.selector = ecs.select(Bounty);
  this.spawnTransform = {
    duration: 1,

    update: function update(entity, stage) {
      var sprite = entity.get(Sprite);
      var scale = 1 - stage;
      sprite && sprite.scale.set(scale);
    }

  };
};

Spawner.prototype.update = function update () {
  var ref = this.canvas;
    var width = ref.width;
    var height = ref.height;
  var padding = (width + height) * 0.05;

  for (var i = this.selector.length; i < this.amount; i++) {
    var sprite = new Sprite(this.frame);
    sprite.rotation = Math.random();
    sprite.scale.set();
    this.layer.add(sprite);
    this.ecs.create().add(new Position(padding + Math.random() * (width - padding * 2), padding + Math.random() * (height - padding * 2), Math.random() * 2 * Math.PI), new Velocity(signRandom(3), signRandom(3), signRandom(2) * Math.PI), new Bounty(), sprite, new Transform(this.spawnTransform));
  }
};
var Render = function Render(ecs, scene) {
  this.scene = scene;
  this.selector = ecs.select(Position, Sprite);
};

Render.prototype.update = function update () {
  this.selector.iterate(function (entity) {
    var position = entity.get(Position);
    var sprite = entity.get(Sprite); // sprite.position.copy(position);

    sprite.position.x = position.x;
    sprite.position.y = position.y;
    sprite.rotation = position.rotation;
  });
  this.scene.render();
};

var t$1 = [],
    n$1 = [],
    r$1 = {},
    e$1 = "_sign",
    o$1 = "_mask";
"undefined" != typeof Symbol && (e$1 = Symbol(e$1), o$1 = Symbol(o$1));

var i$1 = function (t, n) {
  var r = n[t];
  if (!r) { throw new Error("The component is not registered"); }
  return r;
},
    s = i$1.bind(null, e$1),
    a$1 = i$1.bind(null, o$1),
    c = function (n) {
  n.id && t$1.forEach(function (t) {
    return t.match(n);
  });
},
    h$1 = 1,
    f = {},
    u$1 = function (t) {
  this.id = t || (h$1++).toString(36), this.components = Object.assign({}, f), this.mask = 0;
};

u$1.prototype.add = function () {
  var arguments$1 = arguments;

  for (var t = this, n = [], r = arguments.length; r--;) { n[r] = arguments$1[r]; }

  n.forEach(function (n) {
    t.components[s(n.constructor)] = n, t.mask |= a$1(n.constructor);
  }), c(this);
}, u$1.prototype.remove = function () {
  var arguments$1 = arguments;

  for (var t = this, n = [], r = arguments.length; r--;) { n[r] = arguments$1[r]; }

  n.forEach(function (n) {
    var r = s(n),
        e = t.components[r];
    e && (e.destructor && e.destructor(), delete t.components[r], t.mask &= ~a$1(n));
  }), c(this);
}, u$1.prototype.has = function (t) {
  return s(t) in this.components;
}, u$1.prototype.get = function (t) {
  return this.components[t[e$1]];
}, u$1.prototype.eject = function () {
  !function (n) {
    var e = n.components;

    for (var o in e) { if (Object.prototype.hasOwnProperty.call(e, o)) {
      var i = e[o];
      i && i.destructor && i.destructor();
    } }

    t$1.forEach(function (t) {
      return t.remove(n);
    }), delete r$1[n.id], n.id = 0;
  }(this);
};

var p = function (t, n) {
  this.entity = t, this.prev = null, this.next = n;
},
    l = function (t) {
  if (!t) { throw new Error("Empty selector"); }

  for (var n in this.mask = t, this.map = {}, this.list = null, this.length = 0, r$1) { Object.prototype.hasOwnProperty.call(r$1, n) && this.match(r$1[n]); }
};

l.prototype.iterate = function (t) {
  for (var n = this.list; n;) { t(n.entity), n = n.next; }
}, l.prototype.match = function (t) {
  (this.mask & t.mask) === this.mask ? this.add(t) : this.remove(t);
}, l.prototype.add = function (t) {
  if (!this.map[t.id]) {
    var n = new p(t, this.list);
    this.list && (this.list.prev = n), this.list = n, this.map[t.id] = n, this.length++;
  }
}, l.prototype.remove = function (t) {
  var n = this.map[t.id];
  n && (n.prev ? n.prev.next = n.next : this.list = n.next, n.next && (n.next.prev = n.prev), delete this.map[t.id], this.length--);
};
var m = 0,
    v = performance || Date,
    d = v.now.bind(v);
var ecs = {
  register: function () {
    var arguments$1 = arguments;

    for (var t = [], n = arguments.length; n--;) { t[n] = arguments$1[n]; }

    t.forEach(function (t) {
      if (m > 31) { throw new Error("Components limit reached"); }

      if (!t[e$1]) {
        var n = m.toString(36);
        f[n] = null, t[e$1] = n, t[o$1] = 1 << m, m++;
      }
    });
  },
  process: function () {
    var arguments$1 = arguments;

    for (var t = [], r = arguments.length; r--;) { t[r] = arguments$1[r]; }

    t.forEach(function (t) {
      return n$1.push(t);
    });
  },
  create: function (t) {
    var n = new u$1(t);
    if (r$1[n.id]) { throw new Error("The ID already exist"); }
    return r$1[n.id] = n, n;
  },
  get: function (t) {
    return r$1[t];
  },
  select: function () {
    var arguments$1 = arguments;

    for (var n = [], r = arguments.length; r--;) { n[r] = arguments$1[r]; }

    var e = 0;
    n.forEach(function (t) {
      e |= a$1(t);
    });

    for (var o = 0; o < t$1.length; o++) { if (t$1[o].mask === e) { return t$1[o]; } }

    var i = new l(e);
    return t$1.push(i), i;
  },
  update: function (t) {
    var r = {};
    return n$1.forEach(function (n) {
      var e = d();
      n.update(t), r[n.constructor.name] = d() - e;
    }), r;
  }
};

var obj;
var Point = h.Point;
var Texture = h.Texture;
var Frame = h.Frame;
var stats = new Stats();
document.body.appendChild(stats.dom);
var view = document.getElementById('view');
var scene = h(view);
var gl = scene.gl;
scene.background(0.2, 0.2, 0.2);

var atlasImg = function () {
  var canvas = document.createElement('canvas');
  var size = 32;
  canvas.width = 96;
  canvas.height = 32;
  var ctx = canvas.getContext('2d');
  var offset = 0;
  ctx.lineWidth = size / 16;
  ctx.fillStyle = '#33658a';
  ctx.strokeStyle = '#86bbd8';
  ctx.beginPath();
  ctx.moveTo(offset + 16, 16);

  for (var angle = 0; angle < Math.PI * 2; angle += Math.PI * 2 / 5) {
    ctx.lineTo(offset + 16 + Math.cos(angle) * 14, 16 + Math.sin(angle) * 14);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  offset += size;
  ctx.fillStyle = '#30644f';
  ctx.strokeStyle = '#7eb77c';
  ctx.beginPath();
  ctx.moveTo(offset + 3, 3);
  ctx.lineTo(offset + 28, 16);
  ctx.lineTo(offset + 3, 28);
  ctx.lineTo(offset + 8, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  offset += size;

  for (var i = 0.2; i <= 1; i += 0.2) {
    ctx.fillStyle = "rgba(255,255,255," + i + ")";
    ctx.beginPath();
    ctx.arc(offset + 16, 16, 16 - i * 10, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  return canvas;
};

var atlas = Texture(scene, atlasImg(), 0, ( obj = {}, obj[gl.TEXTURE_MAG_FILTER] = gl.LINEAR, obj[gl.TEXTURE_MIN_FILTER] = gl.LINEAR, obj ));
atlas.anchor.set(0.5);
var bountyBitmap = Frame(atlas, Point(), Point(32));
var hunterBitmap = Frame(atlas, Point(32, 0), Point(32));
var particleBitmap = Frame(atlas, Point(64, 0), Point(32));
particleBitmap.width = 4;
particleBitmap.height = 4;
var huntersCount = 1 + view.width * view.height / 100000 * 4 | 0;
var particleLayer = scene.layer(0);
ecs.register(Position, Velocity, Sprite, Bounty, Hunter, Transform);
ecs.process(new Transformer(ecs), new Spawner(ecs, scene, huntersCount * 2, bountyBitmap), new AI(ecs, particleBitmap, particleLayer), new Exhaust(ecs, particleBitmap, particleLayer), new Movement(ecs), new Render(ecs, scene));
var hunterLayer = scene.layer(3);
Array.apply(void 0, Array(huntersCount)).forEach(function () {
  var sprite = new Sprite(hunterBitmap);
  hunterLayer.add(sprite);
  ecs.create().add(new Position(Math.random() * view.width, Math.random() * view.height, Math.random() * 2 * Math.PI), new Velocity(), new Hunter(), sprite);
});
var spritesSel = ecs.select(Sprite);
var sprites = document.getElementById('sprites');
var i$2 = 0;
var last = 0;

var loop = function () {
  stats.begin();
  var now = (performance || Date).now();
  var statistics = ecs.update((now - last || now) / 1000); // ecs.update((now - last || now) / 1000);

  last = now;
  stats.end();
  /*
  console.log(statistics);
  sprites.innerText = `Sprites: ${spritesSel.length}`;
  */

  i$2++;

  if (!(i$2 % 20)) {
    var s = '';
    Object.entries(statistics).forEach(function (ref) {
      var k = ref[0];
      var v = ref[1];

      s += k + ": " + (v.toFixed(1)) + " ms\n";
    });
    s += "\nSprites: " + (spritesSel.length);
    sprites.innerHTML = "<pre>" + s + "</pre>";
    i$2 = 0;
  }

  requestAnimationFrame(loop);
};

loop();
