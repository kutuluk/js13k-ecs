var t=function(t,n){this.c=t,this.p=null,this.n=n,this.d=0;};t.prototype.r=function(){this.d=1;};var n=function(){this.h=null;};n.prototype.add=function(n){var e=new t(n,this.h);return this.h&&(this.h.p=e),this.h=e,e},n.prototype.i=function(t){for(var n=this.h;n;)n.d?(n.p?n.p.n=n.n:this.h=n.n,n.n&&(n.n.p=n.p)):t(n.c),n=n.n;};var e=6408,r=5121,i$1=3553,a=9728,o=33071,u=function(t){this.z=t,this.o=new n,this.t=new n;};u.prototype.add=function(t){t.remove(),t.layer=this,t.n=(function(t){return 1!==t.a||0===t.frame.alphaTest}(t)?this.t:this.o).add(t);};var h=function(t,n){var e=t.getContext("webgl",Object.assign({antialias:!1,alpha:!1},n)),a=e.getExtension("ANGLE_instanced_arrays"),o=function(t,n){var r=e.createShader(n);return e.shaderSource(r,t),e.compileShader(r),r},c=function(t,n,r){var i=e.createBuffer();return e.bindBuffer(t,i),e.bufferData(t,n,r||35044),i},s=[],f={gl:e,camera:{at:h.Point(),to:h.Point(),angle:0},background:function(t,n,r){e.clearColor(t,n,r,1);},layer:function(t){var n=s.find(function(n){return n.z===t});return n||(n=new u(t),s.push(n),s.sort(function(t,n){return n.z-t.z})),n}},l=f.layer(0);f.add=function(t){l.add(t);};var v=function(t,n){var r=o(t,35633),i=o(n,35632),a=e.createProgram();return e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),a}("attribute vec2 g;\nattribute vec2 a;\nattribute vec2 t;\nattribute float r;\nattribute vec2 s;\nattribute vec4 u;\nattribute vec4 c;\nattribute float z;\nuniform mat4 m;\nvarying vec2 v;\nvarying vec4 i;\nvoid main(){\nv=u.xy+g*u.zw;\ni=c.abgr;\nvec2 p=(g-a)*s;\nfloat q=cos(r);\nfloat w=sin(r);\np=vec2(p.x*q-p.y*w,p.x*w+p.y*q);\np+=a+t;\ngl_Position=m*vec4(p,z,1);}","precision mediump float;\nuniform sampler2D x;\nuniform float j;\nvarying vec2 v;\nvarying vec4 i;\nvoid main(){\nvec4 c=texture2D(x,v);\ngl_FragColor=c*i;\nif(j>0.0){\nif(c.a<j)discard;\ngl_FragColor.a=1.0;};}"),p=function(t,n,r,i,o,u,h){var c=e.getAttribLocation(v,t);return e.enableVertexAttribArray(c),e.vertexAttribPointer(c,n,u||5126,!!h,r||0,o||0),i&&a.vertexAttribDivisorANGLE(c,i),c};c(34963,new Uint8Array([0,1,2,2,1,3])),c(34962,new Float32Array([0,0,0,1,1,0,1,1])),p("g",2);var d=new ArrayBuffer(3407820),g=new Float32Array(d),y=new Uint32Array(d);c(34962,d,35048),p("a",2,52,1),p("s",2,52,1,8),p("r",1,52,1,16),p("t",2,52,1,20),p("u",4,52,1,28),p("c",4,52,1,44,r,!0),p("z",1,52,1,48);var x,b,m=function(t){return e.getUniformLocation(v,t)},w=m("m"),P=m("x"),A=m("j"),j=0,T=function(){j&&(e.bufferSubData(34962,0,g.subarray(0,13*j)),a.drawElementsInstancedANGLE(4,6,r,0,j),j=0);},z=function(t){if(t.visible){65535===j&&T();var n=t.frame,r=t.scale,a=t.position,o=n.tex,u=n.uvs,h=t.anchor||n.anchor;x!==o&&(T(),x=o,e.bindTexture(i$1,o),e.uniform1i(P,o),e.uniform1f(A,b?n.alphaTest:0));var c=13*j;g[c++]=h.x,g[c++]=h.y,g[c++]=r.x*n.width,g[c++]=r.y*n.height,g[c++]=t.rotation,g[c++]=a.x,g[c++]=a.y,g[c++]=u[0],g[c++]=u[1],g[c++]=u[2],g[c++]=u[3],y[c++]=((16777215&t.tint)<<8|255*t.a&255)>>>0,g[c++]=-t.layer.z,j++;}};return f.render=function(){var n=t.clientWidth,r=t.clientHeight;t.width=n,t.height=r;var i=f.camera,a=i.at,o=i.to,u=i.angle,h=a.x-n*o.x,c=a.y-r*o.y,l=Math.cos(u),p=Math.sin(u),d=2/n,g=-2/r,y=[l*d,p*g,0,0,-p*d,l*g,0,0,0,0,1e-5,0,(a.x*(1-l)+a.y*p)*d-2*h/n-1,(a.y*(1-l)-a.x*p)*g+2*c/r+1,0,1];e.useProgram(v),e.uniformMatrix4fv(w,!1,y),e.viewport(0,0,n,r),e.clear(16640),e.activeTexture(33984),x=null,e.disable(3042),e.enable(2929),e.depthFunc(513),b=!0,s.forEach(function(t){t.o.i(function(t){return z(t)});}),T(),e.enable(3042),e.blendFunc(770,771),e.depthFunc(515),e.uniform1f(A,0),b=!1;for(var m=s.length;m>0;m--)s[m-1].t.i(function(t){return z(t)});T();},f.render(),f};h.Point=function(){function t(t,n){if(!(this instanceof h.Point))return new h.Point(t,n);this.set(t,n);}return t.prototype.set=function(t,n){return this.x=t||0,this.y=n||(0!==n?this.x:0),this},t.prototype.clone=function(){return h.Point(this.x,this.y)},t}(),h.Frame=function(){function t(n,e,r,i){if(!(this instanceof t))return new t(n,e,r,i);this.texture=n,this.width=r.x,this.height=r.y,this.uvs=[e.x/n.width,e.y/n.height,r.x/n.width,r.y/n.height],this.anchor=i||n.anchor.clone();}var n={alphaTest:{configurable:!0},tex:{configurable:!0}};return n.alphaTest.get=function(){return this.texture.a},n.tex.get=function(){return this.texture.tex},Object.defineProperties(t.prototype,n),t}(),h.Texture=function(){function t(n,u,c,s){if(!(this instanceof t))return new t(n,u,c,s);var f=n.gl,l=Object.assign({10240:a,10241:a,10242:o,10243:o},s);this.tex=f.createTexture(),f.bindTexture(i$1,this.tex),Object.keys(l).forEach(function(t){return f.texParameteri(i$1,t,l[t])}),f.texImage2D(i$1,0,e,e,r,u),this.anchor=h.Point(),this.a=c||(0===c?0:1),this.width=u.width,this.height=u.height,this.uvs=[0,0,1,1];}var n={alphaTest:{configurable:!0}};return n.alphaTest.get=function(){return this.a},Object.defineProperties(t.prototype,n),t}(),h.Sprite=function(){function t(n,e){if(!(this instanceof t))return new t(n,e);this.frame=n,this.a=1,Object.assign(this,{visible:!0,position:h.Point(),scale:h.Point(1),rotation:0,tint:16777215,anchor:null},e),this.remove();}var n={alpha:{configurable:!0}};return n.alpha.get=function(){return this.a},n.alpha.set=function(t){var n=this.a;this.a=t,this.n&&(t<1&&1===n||1===t&&n<1)&&this.layer.add(this);},t.prototype.remove=function(){this.n&&this.n.r(),this.layer=null,this.n=null;},Object.defineProperties(t.prototype,n),t}();

var Vector = /*#__PURE__*/function () {
  function Vector(x, y) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = x;
    }
    this.x = x;
    this.y = y;
  }
  var _proto = Vector.prototype;
  _proto.from = function from(obj) {
    this.x = obj.x;
    this.y = obj.y;
    return this;
  };
  _proto.add = function add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  };
  _proto.sub = function sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  };
  _proto.invert = function invert() {
    this.x *= -1;
    this.y *= -1;
    return this;
  };
  _proto.mul = function mul(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  };
  _proto.div = function div(scalar) {
    if (scalar === 0) {
      this.x = 0;
      this.y = 0;
    } else {
      this.x /= scalar;
      this.y /= scalar;
    }
    return this;
  };
  _proto.norm = function norm() {
    var length = this.length();
    if (length === 0) {
      this.x = 1;
      this.y = 0;
    } else {
      this.div(length);
    }
    return this;
  };
  _proto.rotate = function rotate(angle) {
    var nx = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    var ny = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    this.x = nx;
    this.y = ny;
    return this;
  };
  _proto.lengthSq = function lengthSq() {
    return this.x * this.x + this.y * this.y;
  };
  _proto.length = function length() {
    return Math.sqrt(this.lengthSq());
  };
  _proto.distanceSq = function distanceSq(vec) {
    var dx = this.x - vec.x;
    var dy = this.y - vec.y;
    return dx * dx + dy * dy;
  };
  _proto.distance = function distance(vec) {
    return Math.sqrt(this.distanceSq(vec));
  };
  _proto.angle = function angle() {
    return Math.atan2(this.y, this.x);
  };
  _proto.cross = function cross(vec) {
    return this.x * vec.y - this.y * vec.x;
  };
  _proto.dot = function dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  };
  _proto.clone = function clone() {
    return new Vector(this.x, this.y);
  };
  return Vector;
}();

var vecFromAngle = function vecFromAngle(angle) {
  return new Vector(Math.cos(angle), Math.sin(angle));
};
var signRandom = function signRandom(scale) {
  if (scale === void 0) {
    scale = 1;
  }
  return (Math.random() - 0.5) * scale;
};
var clamp = function clamp(a, b, c) {
  if (c < a) {
    return a;
  }
  if (c > b) {
    return b;
  }
  return c;
};

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var VectorWithRotation = /*#__PURE__*/function (_Vector) {
  function VectorWithRotation(x, y, rotation) {
    var _this;
    _this = _Vector.call(this, x, y) || this;
    _this.rotation = rotation || 0;
    return _this;
  }
  _inheritsLoose(VectorWithRotation, _Vector);
  return VectorWithRotation;
}(Vector);
var Position = /*#__PURE__*/function (_VectorWithRotation) {
  function Position() {
    return _VectorWithRotation.apply(this, arguments) || this;
  }
  _inheritsLoose(Position, _VectorWithRotation);
  return Position;
}(VectorWithRotation);
var Velocity = /*#__PURE__*/function (_VectorWithRotation2) {
  function Velocity() {
    return _VectorWithRotation2.apply(this, arguments) || this;
  }
  _inheritsLoose(Velocity, _VectorWithRotation2);
  return Velocity;
}(VectorWithRotation);
var Sprite = /*#__PURE__*/function (_Renderer$Sprite) {
  function Sprite() {
    return _Renderer$Sprite.apply(this, arguments) || this;
  }
  _inheritsLoose(Sprite, _Renderer$Sprite);
  var _proto = Sprite.prototype;
  _proto.destructor = function destructor() {
    this.remove();
  };
  return Sprite;
}(h.Sprite);
var Exhaust = function Exhaust(rate) {
  this.rate = rate;
  this.cooldown = 0;
};
var Attractor = function Attractor(radius, speed) {
  this.radius = radius;
  this.speed = speed;
};
var Transform = function Transform(transformer) {
  this.transformer = transformer;
  this.remaining = transformer.duration;
};
var Bounty = function Bounty() {
  this.targeted = true;
};
var Hunter = function Hunter() {
  this.target = null;
  this.distance = null;
  this.speed = 150 + 20 * Math.random();
  this.agi = 1.3 * Math.PI;
};
var Greed = /*#__PURE__*/function () {
  function Greed() {
    this.cell = null;
  }
  var _proto2 = Greed.prototype;
  _proto2.destructor = function destructor(entity) {
    var _this$cell;
    (_this$cell = this.cell) == null || _this$cell["delete"](entity);
  };
  return Greed;
}();

var MovementSystem = /*#__PURE__*/function () {
  function MovementSystem(world) {
    this.query = world.query(Position, Velocity);
  }
  var _proto = MovementSystem.prototype;
  _proto.update = function update(delta) {
    this.query.iterate(function (_ref) {
      var position = _ref[0],
        velocity = _ref[1];
      position.x += velocity.x * delta;
      position.y += velocity.y * delta;
      position.rotation += velocity.rotation * delta;
    });
  };
  return MovementSystem;
}();
var spawnTransform = {
  duration: 1 / 4,
  end: function end(entity) {
    entity.get(Bounty).targeted = false;
  },
  update: function update(entity, stage) {
    var sprite = entity.get(Sprite);
    sprite && sprite.scale.set(stage);
  }
};
var exhaustTransform = {
  duration: 0.8,
  end: function end(entity) {
    entity["delete"]();
  },
  update: function update(entity, stage) {
    var sprite = entity.get(Sprite);
    if (sprite) {
      sprite.alpha = 1 - stage;
      sprite.scale.set(0.7 + stage);
    }
  }
};
var fireTransform = {
  duration: 1 / 3,
  end: function end(entity) {
    entity["delete"]();
  },
  update: function update(entity, stage) {
    var sprite = entity.get(Sprite);
    sprite && (sprite.alpha = 1 - stage);
  }
};
var deathTransform = {
  duration: 1 / 4,
  end: function end(entity) {
    entity["delete"]();
  },
  update: function update(entity, stage) {
    var sprite = entity.get(Sprite);
    sprite && sprite.scale.set(1 - stage);
  }
};
var ExhaustProcessor = /*#__PURE__*/function () {
  function ExhaustProcessor(world, frame, layer) {
    this.world = world;
    this.frame = frame;
    this.layer = layer;
    this.query = world.query(Exhaust, Position);
  }
  var _proto2 = ExhaustProcessor.prototype;
  _proto2.update = function update(delta) {
    var _this = this;
    this.query.iterate(function (_ref2) {
      var exhaust = _ref2[0],
        position = _ref2[1];
      exhaust.cooldown -= delta;
      if (exhaust.cooldown <= 0) {
        var direction = vecFromAngle(position.rotation + Math.PI * signRandom());
        var offset = vecFromAngle(position.rotation).mul(18);
        var sprite = new Sprite(_this.frame, {
          tint: 0xfbf98c
        });
        _this.layer.add(sprite);
        _this.world.create().add(new Position().from(position).sub(offset), new Velocity().from(direction).mul(Math.random() * 20), sprite, new Transform(exhaustTransform));
        exhaust.cooldown = exhaust.rate;
      }
    });
  };
  return ExhaustProcessor;
}();
var AttractorProcessor = function AttractorProcessor(world) {
  var query = world.query(Hunter, Position, Attractor);
  this.update = function (delta) {
    query.iterate(function (_ref3) {
      var _hunter$target;
      var hunter = _ref3[0],
        hunterPosition = _ref3[1],
        attractor = _ref3[2];
      if (!((_hunter$target = hunter.target) != null && _hunter$target.exists)) {
        return;
      }
      var _hunter$target$get = hunter.target.get(Bounty, Position),
        bounty = _hunter$target$get[0],
        bountyPosition = _hunter$target$get[1];
      if (bounty && bountyPosition && hunterPosition.distanceSq(bountyPosition) < Math.pow(attractor.radius, 2)) {
        var vec = hunterPosition.clone().sub(bountyPosition);
        var speed = attractor.speed * (1 + 3 * (1 - vec.length() / attractor.radius));
        bountyPosition.add(vec.norm().mul(speed * delta));
      }
    });
  };
};
var SpaceUpdater = /*#__PURE__*/function () {
  function SpaceUpdater(world, spaceManager) {
    this.query = world.query(Position, Greed);
    this.spaceManager = spaceManager;
  }
  var _proto3 = SpaceUpdater.prototype;
  _proto3.update = function update() {
    var _this2 = this;
    this.query.iterate(function (_ref4, entity) {
      var _ref4$ = _ref4[0],
        x = _ref4$.x,
        y = _ref4$.y,
        greed = _ref4[1];
      var cell = _this2.spaceManager.getCell(x, y);
      cell.add(entity);
      var greedCell = greed.cell;
      greed.cell = cell;
      greedCell && greedCell !== cell && greedCell["delete"](entity);
    });
  };
  return SpaceUpdater;
}();
var TransformSystem = /*#__PURE__*/function () {
  function TransformSystem(world) {
    this.query = world.query(Transform);
  }
  var _proto4 = TransformSystem.prototype;
  _proto4.update = function update(delta) {
    this.query.iterate(function (transform, entity) {
      transform.remaining -= delta;
      if (transform.remaining <= 0) {
        transform.transformer.update == null || transform.transformer.update(entity, 1);
        transform.transformer.end == null || transform.transformer.end(entity);
        transform.transformer = transform.transformer.next;
        if (!transform.transformer) {
          entity.remove(Transform);
          return;
        }
        transform.remaining += transform.transformer.duration;
      }
      transform.transformer.update == null || transform.transformer.update(entity, 1 - transform.remaining / transform.transformer.duration);
    });
  };
  return TransformSystem;
}();
var IntersectionProcessor = function IntersectionProcessor(world, explosionFrame, particleLayer) {
  var query = world.query(Hunter, Position);
  var explosionColors = [0x33658a, 0x86bbd8];
  var fireTransforms = [_extends({}, fireTransform, {
    duration: 1 / 3
  }), _extends({}, fireTransform, {
    duration: 1 / 4
  }), _extends({}, fireTransform, {
    duration: 1 / 5
  })];
  this.update = function () {
    query.iterate(function (_ref5) {
      var hunter = _ref5[0];
      if (hunter.target && hunter.distance < Math.pow(10, 2)) {
        var bounty = hunter.target;
        if (bounty.get(Bounty)) {
          bounty.remove(Bounty);
          bounty.add(new Transform(deathTransform));
          var position = bounty.get(Position);
          if (position) {
            for (var angle = 0; angle < Math.PI * 2; angle += Math.PI / 10) {
              var velocity = vecFromAngle(angle).mul(80 * (1 + 0.5 * Math.random()));
              var sprite = new Sprite(explosionFrame);
              sprite.tint = explosionColors[Math.round(Math.random())];
              particleLayer.add(sprite);
              world.create().add(new Position().from(position), new Velocity().from(velocity), sprite, new Transform(fireTransforms[~~(Math.random() * 3)]));
            }
          }
        }
        hunter.target = null;
        hunter.distance = null;
      }
    });
  };
};
var TargetingSystem = /*#__PURE__*/function () {
  function TargetingSystem(world, spaceManager) {
    this.spaceManager = spaceManager;
    this.hunters = world.query(Hunter, Position);
    this.bounties = world.query(Bounty, Position);
  }
  var _proto5 = TargetingSystem.prototype;
  _proto5.targetNearestBounty = function targetNearestBounty(hunter, hunterPosition, radius) {
    var bountyDistance = hunter.target ? hunter.distance = hunter.target.get(Position).distanceSq(hunterPosition) : Infinity;
    var bountyCandidat = null;
    this.spaceManager.get(hunterPosition, radius, function (entity) {
      var _entity$get = entity.get(Bounty, Position),
        bounty = _entity$get[0],
        bountyPosition = _entity$get[1];
      if (bounty && bountyPosition) {
        if (bounty.targeted) {
          return;
        }
        var distance = hunterPosition.distanceSq(bountyPosition);
        if (distance < bountyDistance) {
          bountyDistance = distance;
          bountyCandidat = entity;
        }
      }
    });
    if (bountyCandidat) {
      hunter.target && (hunter.target.get(Bounty).targeted = false);
      hunter.target = bountyCandidat;
      hunter.distance = bountyDistance;
      bountyCandidat.get(Bounty).targeted = true;
      return true;
    }
  };
  _proto5.update = function update() {
    var _this3 = this;
    this.hunters.iterate(function (_ref6) {
      var hunter = _ref6[0],
        hunterPosition = _ref6[1];
      if (hunter.target) {
        _this3.targetNearestBounty(hunter, hunterPosition, 200);
        return;
      }
      if (_this3.targetNearestBounty(hunter, hunterPosition, 500)) {
        return;
      }
      var bountyDistance = Infinity;
      var bountyCandidat = null;
      _this3.bounties.iterate(function (_ref7, bountyEntity) {
        var bounty = _ref7[0],
          bountyPosition = _ref7[1];
        if (bounty.targeted) {
          return;
        }
        var distance = hunterPosition.distanceSq(bountyPosition);
        if (distance < bountyDistance) {
          bountyDistance = distance;
          bountyCandidat = bountyEntity;
        }
      });
      if (bountyCandidat) {
        hunter.distance = bountyDistance;
        hunter.target = bountyCandidat;
        bountyCandidat.get(Bounty).targeted = true;
      }
    });

    // this.bounties.iterate(([bounty], bountyEntity) => {
    //     const sprite = bountyEntity.get(Sprite);
    //     if (bounty.targeted) {
    //         sprite.tint = 0xff6666;
    //     } else {
    //         sprite.tint = 0xffffff;
    //     }
    // });
  };
  return TargetingSystem;
}();
var HunterControlSystem = /*#__PURE__*/function () {
  function HunterControlSystem(world) {
    this.hunters = world.query(Hunter, Position, Velocity);
  }
  var _proto6 = HunterControlSystem.prototype;
  _proto6.update = function update(delta) {
    this.hunters.iterate(function (_ref8) {
      var hunter = _ref8[0],
        position = _ref8[1],
        velocity = _ref8[2];
      var target = hunter.target,
        speed = hunter.speed,
        agi = hunter.agi;
      if (target != null && target.exists) {
        var bountyPosition = target.get(Position);
        var s = bountyPosition.clone().sub(position);
        var direction = vecFromAngle(position.rotation);
        var angle = Math.atan2(direction.cross(s), direction.dot(s));
        var maxAngle = agi * delta;
        if (Math.abs(angle) > maxAngle) {
          angle = maxAngle * Math.sign(angle);
        }
        velocity.from(direction).mul(speed);
        velocity.rotation = angle / delta;
      }
    });
  };
  return HunterControlSystem;
}();
var Spawner = /*#__PURE__*/function () {
  function Spawner(world, scene, amount, frame) {
    this.world = world;
    this.amount = amount;
    this.frame = frame;
    this.canvas = scene.gl.canvas;
    this.layer = scene.layer(2);
    this.query = world.query(Bounty);
  }
  var _proto7 = Spawner.prototype;
  _proto7.update = function update() {
    var _this$canvas = this.canvas,
      width = _this$canvas.width,
      height = _this$canvas.height;
    var padding = Math.sqrt(width * height) * 0.05;
    for (var i = this.query.length; i < this.amount; i++) {
      var sprite = new Sprite(this.frame);
      sprite.rotation = Math.random();
      sprite.scale.set();
      this.layer.add(sprite);
      this.world.create().add(new Position(padding + Math.random() * (width - padding * 2), padding + Math.random() * (height - padding * 2), Math.random() * 2 * Math.PI), new Greed(), new Velocity(signRandom(30), signRandom(30), signRandom(2) * Math.PI), new Bounty(), sprite, new Transform(spawnTransform));
    }
  };
  return Spawner;
}();
var Render = /*#__PURE__*/function () {
  function Render(world) {
    this.query = world.query(Position, Sprite);
  }
  var _proto8 = Render.prototype;
  _proto8.update = function update() {
    this.query.iterate(function (_ref9) {
      var position = _ref9[0],
        sprite = _ref9[1];
      sprite.position.x = position.x;
      sprite.position.y = position.y;
      sprite.rotation = position.rotation;
    });
  };
  return Render;
}();

var empty = new Map();
var components = new Set();
var ecsComponentMask = Symbol('m');
var bit = 0;
var Entity = /*#__PURE__*/function () {
  function Entity(world) {
    this._world = world;
    this._components = new Map();
    this._mask = BigInt(0);
  }
  var _proto = Entity.prototype;
  _proto.add = function add() {
    var _this = this;
    if (this.exists) {
      [].slice.call(arguments).forEach(function (component) {
        var _component$constructo;
        var mask = component == null || (_component$constructo = component.constructor) == null ? void 0 : _component$constructo[ecsComponentMask];
        if (mask) {
          var _this$_components$get;
          (_this$_components$get = _this._components.get(mask)) == null || _this$_components$get.destructor == null || _this$_components$get.destructor(_this);
          _this._components.set(mask, component);
          _this._mask |= mask;
        }
      });
      this._world._matchEntity(this);
    }
    return this;
  };
  _proto.remove = function remove() {
    var _this2 = this;
    if (this.exists) {
      [].slice.call(arguments).forEach(function (Component) {
        var mask = Component[ecsComponentMask];
        var component = _this2._components.get(mask);
        if (component) {
          component.destructor == null || component.destructor(_this2);
          _this2._components["delete"](mask);
          _this2._mask &= ~mask;
        }
      });
      this._world._matchEntity(this);
    }
    return this;
  };
  _proto.get = function get() {
    var _this3 = this;
    var result = [].slice.call(arguments).map(function (Component) {
      return _this3._components.get(Component[ecsComponentMask]) || null;
    });
    return result.length > 1 ? result : result[0];
  };
  _proto["delete"] = function _delete() {
    var _this4 = this;
    this._components.forEach(function (component) {
      return component.destructor == null ? void 0 : component.destructor(_this4);
    });
    this._world._queries.forEach(function (query) {
      return query._remove(_this4);
    });
    this._world._entities["delete"](this);
    this._components = empty;
  };
  return _createClass(Entity, [{
    key: "exists",
    get: function get() {
      return this._components === empty ? null : this;
    }
  }]);
}();
var Query = /*#__PURE__*/function () {
  function Query(world, mask, Components, parent) {
    var set = (parent == null ? void 0 : parent._set) || new Set();
    this._set = set;
    this._mask = mask;
    this._components = Components;
    this._match = function (entity) {
      mask && (mask & entity._mask) === mask && set.add(entity) || set["delete"](entity);
    };
    !parent && world._entities.forEach(this._match);
  }
  var _proto2 = Query.prototype;
  _proto2._check = function _check(Components) {
    this._components.every(function (c, i) {
      return c === Components[i];
    });
  };
  _proto2._remove = function _remove(entity) {
    this._set["delete"](entity);
  };
  _proto2.iterate = function iterate(fn) {
    var _this5 = this;
    this._set.forEach(function (entity) {
      return fn(entity.get.apply(entity, _this5._components), entity);
    });
  };
  return _createClass(Query, [{
    key: "length",
    get: function get() {
      return this._set.size;
    }
  }]);
}();
var World = /*#__PURE__*/function () {
  function World() {
    this._queries = [];
    this._entities = new Set();
  }
  var _proto3 = World.prototype;
  _proto3._matchEntity = function _matchEntity(entity) {
    this._queries.forEach(function (query) {
      return query._match(entity);
    });
  };
  _proto3.create = function create() {
    var entity = new Entity(this);
    this._entities.add(entity);
    return entity;
  };
  _proto3.query = function query() {
    var Components = [].slice.call(arguments);
    var mask = Components.reduce(function (mask, Component) {
      return mask |= Component[ecsComponentMask];
    }, BigInt(0));
    var query = this._queries.find(function (q) {
      return q._mask === mask;
    });
    if (!query) {
      query = new Query(this, mask, Components);
      this._queries.push(query);
    }
    if (!query._check(Components)) {
      return new Query(this, mask, Components, query);
    }
    return query;
  };
  _proto3.update = function update(pipeline) {
    var _arguments = arguments;
    pipeline.forEach(function (system) {
      return system.update.apply(system, [].slice.call(_arguments, 1));
    });
  };
  _proto3.reset = function reset() {
    this._entities.forEach(function (entity) {
      return entity["delete"]();
    });
  };
  return World;
}();
var registerComponents$1 = function registerComponents() {
  [].slice.call(arguments).forEach(function (Component) {
    if (!components.has(Component)) {
      Component[ecsComponentMask] = BigInt('0b1'.padEnd(3 + bit++, '0'));
      components.add(Component);
    }
  });
};
var createWorld$1 = function createWorld() {
  return new World();
};
var ecs = [registerComponents$1, createWorld$1];

var _Texture;
var registerComponents = ecs[0],
  createWorld = ecs[1];
var Point = h.Point,
  Texture = h.Texture,
  Frame = h.Frame;
var stats = new Stats();
document.body.appendChild(stats.dom);
var view = document.getElementById('view');
var scene = h(view);
var gl = scene.gl;
scene.background(0.2, 0.2, 0.2);
var atlasImg = function atlasImg() {
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
    ctx.lineTo(offset + 16 + Math.cos(angle) * 10, 16 + Math.sin(angle) * 10);
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
  for (var _i = 0.2; _i <= 1; _i += 0.2) {
    ctx.fillStyle = "rgba(255,255,255," + _i + ")";
    ctx.beginPath();
    ctx.arc(offset + 16, 16, 16 - _i * 10, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  return canvas;
};
var atlas = Texture(scene, atlasImg(), 0, (_Texture = {}, _Texture[gl.TEXTURE_MAG_FILTER] = gl.LINEAR, _Texture[gl.TEXTURE_MIN_FILTER] = gl.LINEAR, _Texture));
atlas.anchor.set(0.5);
var bountyBitmap = Frame(atlas, Point(), Point(32));
var hunterBitmap = Frame(atlas, Point(32, 0), Point(32));
var particleBitmap = Frame(atlas, Point(64, 0), Point(32));
particleBitmap.width = 4;
particleBitmap.height = 4;
var explosionBitmap = Frame(atlas, Point(64, 0), Point(32));
explosionBitmap.width = 12;
explosionBitmap.height = 12;
var huntersCount = 1 + Math.round(view.width * view.height / Math.pow(150, 2));
var particleLayer = scene.layer(0);
var hunterLayer = scene.layer(3);
var SpaceManager = /*#__PURE__*/function () {
  function SpaceManager(cellSize, mapSize) {
    this.cellSize = cellSize;
    this.size = Math.ceil(mapSize / cellSize);
    this.space = Array.from({
      length: Math.pow(this.size, 2)
    }).map(function () {
      return new Set();
    });
  }
  var _proto = SpaceManager.prototype;
  _proto.getCellCoords = function getCellCoords(x, y) {
    var cx = clamp(0, this.size - 1, ~~(x / this.cellSize));
    var cy = clamp(0, this.size - 1, ~~(y / this.cellSize));
    return [cx, cy];
  };
  _proto.getCell = function getCell(x, y) {
    var _this$getCellCoords = this.getCellCoords(x, y),
      cx = _this$getCellCoords[0],
      cy = _this$getCellCoords[1];
    return this.space[cx + cy * this.size];
  };
  _proto.get = function get(point, radius, iterator) {
    var x = point.x,
      y = point.y;
    var _this$getCellCoords2 = this.getCellCoords(x - radius, y - radius),
      left = _this$getCellCoords2[0],
      top = _this$getCellCoords2[1];
    var _this$getCellCoords3 = this.getCellCoords(x + radius, y + radius),
      right = _this$getCellCoords3[0],
      bottom = _this$getCellCoords3[1];
    for (var cx = left; cx <= right; cx++) {
      for (var cy = top; cy <= bottom; cy++) {
        var cell = this.space[cx + cy * this.size];
        cell.forEach(function (entity) {
          var _entity$exists;
          var position = (_entity$exists = entity.exists) == null ? void 0 : _entity$exists.get(Position);
          position && position.distanceSq(point) < radius * radius && iterator(entity);
        });
      }
    }
  };
  return SpaceManager;
}();
var spaceManager = new SpaceManager(100, 10000);
registerComponents(Position, Velocity, Sprite, Bounty, Hunter, Transform, Exhaust, Attractor, Greed);
var world = createWorld();
var pipeline = [new TransformSystem(world), new IntersectionProcessor(world, explosionBitmap, particleLayer), new TargetingSystem(world, spaceManager), new HunterControlSystem(world), new ExhaustProcessor(world, particleBitmap, particleLayer), new AttractorProcessor(world), new MovementSystem(world), new Spawner(world, scene, ~~(huntersCount * 1.5), bountyBitmap), new SpaceUpdater(world, spaceManager), new Render(world)];
for (var _i2 = huntersCount; _i2 > 0; _i2--) {
  var sprite = new Sprite(hunterBitmap);
  hunterLayer.add(sprite);
  var angle = Math.random() * 2 * Math.PI;
  var hunter = new Hunter();
  world.create().add(new Position(Math.random() * view.width, Math.random() * view.height, angle), new Greed(), new Velocity().from(vecFromAngle(angle).mul(hunter.speed)), hunter, new Exhaust(1 / 60), new Attractor(30, 100), sprite);
}
var spritesQuery = world.query(Sprite);
var info = document.getElementById('info');
var i = 0;
var last = 0;
var nowFunc = typeof performance === 'undefined' ? Date : performance;
var getNow = function getNow() {
  return nowFunc.now();
};
var _loop = function loop() {
  stats.begin();
  var now = getNow();
  var delta = now - last;
  last = now;
  if (delta > 1000) {
    delta = 1000 / 60;
  }
  var statistics = {};
  pipeline.forEach(function (system) {
    var begin = getNow();
    system.update(delta / 1000);
    statistics[system.constructor.name] = getNow() - begin;
  });
  scene.render();
  stats.end();
  if (!(i++ % 20)) {
    var s = '';
    var total = 0;
    Object.entries(statistics).forEach(function (_ref) {
      var k = _ref[0],
        v = _ref[1];
      total += v;
      s += k + ": " + v.toFixed(1) + " ms\n";
    });
    s += "\nTotal: " + total.toFixed(1) + " ms\n";
    s += "\nEntities: " + spritesQuery.length;
    info.textContent = s;
  }
  requestAnimationFrame(_loop);
};
requestAnimationFrame(_loop);
