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

var t = function (t, r) {
    this.c = t, this.p = null, this.n = r, this.d = !1;
};
t.prototype.remove = function () {
    this.d = !0;
};
var r = function () {
    this.h = null;
};
r.prototype.add = function (r) {
    var e = new t(r, this.h);
    return this.h && (this.h.p = e), this.h = e, e;
}, r.prototype.iterate = function (t) {
    var this$1 = this;

    for (var r = this.h;r; ) 
        { r.d ? (r.p ? (r.p.n = r.n) : (this$1.h = r.n), r.n && (r.n.p = r.p)) : t(r.c), r = r.n; }
};
var e = function (t) {
    this.l = new r(), this.z = t;
};
e.prototype.add = function (t) {
    t.node = this.l.add(t);
};
var n = function (t) {
    this.bitmap = t, this.anchor = {
        x: .5,
        y: .5
    }, this.position = {
        x: 0,
        y: 0
    }, this.rotation = 0, this.scale = {
        x: 1,
        y: 1
    }, this.tint = 16777215, this.alpha = 1, this.visible = !0, this.node = null;
};
n.prototype.remove = function () {
    this.node && this.node.remove();
};
var i = function (t, r) {
    var n = t.getContext("webgl", r), i = n.getExtension("ANGLE_instanced_arrays"), a = function (t, r) {
        var e = n.createShader(r);
        return n.shaderSource(e, t), n.compileShader(e), e;
    }, o = function (t, r, e) {
        var i = n.createBuffer();
        return n.bindBuffer(t, i), n.bufferData(t, r, e), i;
    }, u = [], c = function (t) {
        var r = u.find(function (r) {
            return r.z === t;
        });
        if (r) 
            { return r; }
        var n = new e(t);
        return u.push(n), u.sort(function (t, r) {
            return t.z < r.z ? -1 : t.z > r.z ? 1 : 0;
        }), n;
    }, h = c(0), v = (function (t, r) {
        var e = a(t, n.VERTEX_SHADER), i = a(r, n.FRAGMENT_SHADER), o = n.createProgram();
        return n.attachShader(o, e), n.attachShader(o, i), n.linkProgram(o), o;
    })("precision mediump float;\nattribute vec2 g;\nattribute vec2 a;\nattribute vec2 t;\nattribute float r;\nattribute vec2 s;\nattribute vec4 u;\nattribute vec4 c;\nuniform mat4 m;\nvarying vec2 v;\nvarying vec4 vc;\nvoid main(){\nv=u.xy+g*u.zw;\nvc=c.abgr;\nvec2 p=(g-a)*s;\nfloat cr=cos(r);\nfloat sr=sin(r);\np=vec2(p.x*cr-p.y*sr,p.x*sr+p.y*cr);\np+=a+t;\ngl_Position=m*vec4(p,0,1);}", "precision mediump float;\nuniform sampler2D x;\nvarying vec2 v;\nvarying vec4 vc;\nvoid main(){\ngl_FragColor=texture2D(x,v)*vc;}"), E = function (t, r, e, a, o, u, c) {
        var h = n.getAttribLocation(v, t);
        return n.enableVertexAttribArray(h), n.vertexAttribPointer(h, r, u || n.FLOAT, !(!c), e || 0, o || 0), a && i.vertexAttribDivisorANGLE(h, a), h;
    };
    o(n.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,2,1,3]), n.STATIC_DRAW), o(n.ARRAY_BUFFER, new Float32Array([0,
        0,0,1,1,0,1,1]), n.STATIC_DRAW), E("g", 2);
    var s = new ArrayBuffer(3145680), f = new Float32Array(s), T = new Uint32Array(s);
    o(n.ARRAY_BUFFER, s, n.STREAM_DRAW), E("a", 2, 48, 1), E("s", 2, 48, 1, 8), E("r", 1, 48, 1, 16), E("t", 2, 48, 1, 20), E("u", 4, 48, 1, 28), E("c", 4, 48, 1, 44, n.UNSIGNED_BYTE, !0);
    var R, A = n.getUniformLocation(v, "m"), d = n.getUniformLocation(v, "x"), l = 0, p = function () {
        l && (n.bufferSubData(n.ARRAY_BUFFER, 0, f.subarray(0, 12 * l)), i.drawElementsInstancedANGLE(n.TRIANGLES, 6, n.UNSIGNED_SHORT, 0, l), l = 0);
    }, _ = function () {
        var r = t.clientWidth, e = t.clientHeight;
        t.width = r, t.height = e, n.viewport(0, 0, r, e), n.enable(n.BLEND), n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA), n.clear(n.COLOR_BUFFER_BIT);
        var i = [2 / r,0,0,0,0,-2 / e,0,0,0,0,1,0,-1,1,0,1];
        n.useProgram(v), n.activeTexture(n.TEXTURE0), n.uniformMatrix4fv(A, !1, i), R = null, u.forEach(function (t) {
            return t.l.iterate(function (t) {
                return (function (t) {
                    if (t.visible) {
                        65535 === l && p();
                        var r = t.bitmap, e = r.tex, i = r.width, a = r.height, o = r.uvs;
                        R !== e && (p(), R = e, n.bindTexture(n.TEXTURE_2D, e), n.uniform1i(d, e));
                        var u = 12 * l;
                        f[u++] = t.anchor.x, f[u++] = t.anchor.y, f[u++] = t.scale.x * i, f[u++] = t.scale.y * a, f[u++] = t.rotation, f[u++] = t.position.x, f[u++] = t.position.y, f[u++] = o[0], f[u++] = o[1], f[u++] = o[2], f[u++] = o[3], T[u++] = ((16777215 & t.tint) << 8 | 255 * t.alpha & 255) >>> 0, l++;
                    }
                })(t);
            });
        }), p();
    };
    return _(), {
        gl: n,
        bkg: function (t, r, e) {
            n.clearColor(t, r, e, 1);
        },
        texture: function (t, r, e, i, a) {
            var o = n.createTexture();
            return n.bindTexture(n.TEXTURE_2D, o), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, r || n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, e || n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, a || n.LINEAR), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, i || n.LINEAR), n.texImage2D(n.TEXTURE_2D, 0, n.RGBA, n.RGBA, n.UNSIGNED_BYTE, t), n.generateMipmap(n.TEXTURE_2D), {
                tex: o,
                width: t.width,
                height: t.height,
                uvs: [0,0,1,1]
            };
        },
        bitmap: function (t, r, e, n, i) {
            var a = n - r + 1, o = i - e + 1;
            return {
                tex: t.tex,
                width: a,
                height: o,
                uvs: [r / t.width,e / t.height,a / t.width,o / t.height]
            };
        },
        layer: c,
        add: function (t) {
            h.add(t);
        },
        render: _
    };
};
i.Sprite = n;

var VectorWithRotation = (function (Vector$$1) {
    function VectorWithRotation(x, y, rotation) {
        Vector$$1.call(this, x, y);
        this.rotation = rotation || 0;
    }

    if ( Vector$$1 ) VectorWithRotation.__proto__ = Vector$$1;
    VectorWithRotation.prototype = Object.create( Vector$$1 && Vector$$1.prototype );
    VectorWithRotation.prototype.constructor = VectorWithRotation;

    return VectorWithRotation;
}(Vector));
var Position = (function (VectorWithRotation) {
    function Position () {
        VectorWithRotation.apply(this, arguments);
    }if ( VectorWithRotation ) Position.__proto__ = VectorWithRotation;
    Position.prototype = Object.create( VectorWithRotation && VectorWithRotation.prototype );
    Position.prototype.constructor = Position;

    

    return Position;
}(VectorWithRotation));
var Velocity = (function (VectorWithRotation) {
    function Velocity () {
        VectorWithRotation.apply(this, arguments);
    }if ( VectorWithRotation ) Velocity.__proto__ = VectorWithRotation;
    Velocity.prototype = Object.create( VectorWithRotation && VectorWithRotation.prototype );
    Velocity.prototype.constructor = Velocity;

    

    return Velocity;
}(VectorWithRotation));
var Sprite = (function (superclass) {
    function Sprite(bitmap, layer) {
        superclass.call(this, bitmap);
        layer && layer.add(this);
    }

    if ( superclass ) Sprite.__proto__ = superclass;
    Sprite.prototype = Object.create( superclass && superclass.prototype );
    Sprite.prototype.constructor = Sprite;
    Sprite.prototype.destructor = function destructor () {
        this.remove();
    };

    return Sprite;
}(i.Sprite));
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
};

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
    duration: 1 / 2,
    end: function end(entity) {
        entity.eject();
    },
    update: function update(entity, stage) {
        var sprite = entity.get(Sprite);
        sprite && (sprite.alpha = stage);
    }
};
var Exhaust = function Exhaust(ecs, sprite, layer) {
    this.ecs = ecs;
    this.sprite = sprite;
    this.layer = layer;
    this.selector = ecs.select(Hunter, Position);
};
Exhaust.prototype.update = function update () {
        var this$1 = this;

    this.selector.iterate(function (entity) {
        var position = entity.get(Position);
        var direction = vecFromAngle(position.rotation + Math.PI * signRandom());
        var offset = vecFromAngle(position.rotation).mul(8);
        var sprite = new Sprite(this$1.sprite, this$1.layer);
        sprite.tint = 0xfbf98c;
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
var AI = function AI(ecs, particleBitmap, particleLayer) {
    this.ecs = ecs;
    this.hunters = ecs.select(Hunter);
    this.bounties = ecs.select(Bounty);
    this.hunterTransform = {
        duration: 1 / 6,
        update: function update(entity, stage) {
            var sprite = entity.get(Sprite);
            var scale = 1 + (1 - stage) * 0.2;
            sprite && (sprite.scale = {
                x: scale,
                y: scale
            });
        },
        next: {
            duration: 1 / 4,
            update: function update(entity, stage) {
                var sprite = entity.get(Sprite);
                var scale = 1.2 - (1 - stage) * 0.2;
                sprite && (sprite.scale = {
                    x: scale,
                    y: scale
                });
            },
            end: function end(entity) {
                var sprite = entity.get(Sprite);
                sprite && (sprite.scale = {
                    x: 1,
                    y: 1
                });
            }
        }
    };
    this.deathTransform = {
        duration: 1 / 4,
        end: function end(entity) {
            var position = entity.get(Position);
            if (position) {
                for (var angle = 0;angle < Math.PI * 2; angle += Math.PI / 10) {
                    var velocity = vecFromAngle(angle).mul(100 * (1 + Math.random()));
                    var sprite = new Sprite(particleBitmap, particleLayer);
                    sprite.tint = 0xf26419;
                    ecs.create().add(new Position().from(position), new Velocity().from(velocity), sprite, new Transform(exhaustTransform));
                }
            }
            entity.eject();
        },
        update: function update(entity, stage) {
            var sprite = entity.get(Sprite);
            sprite && (sprite.scale = {
                x: stage,
                y: stage
            });
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
var Spawner = function Spawner(ecs, renderer, amount, bitmap) {
    this.ecs = ecs;
    this.amount = amount;
    this.bitmap = bitmap;
    this.canvas = renderer.gl.canvas;
    this.layer = renderer.layer(2);
    this.selector = ecs.select(Bounty);
    this.spawnTransform = {
        duration: 1,
        update: function update(entity, stage) {
            var sprite = entity.get(Sprite);
            var scale = 1 - stage;
            sprite && (sprite.scale = {
                x: scale,
                y: scale
            });
        }
    };
};
Spawner.prototype.update = function update () {
        var this$1 = this;

    var ref = this.canvas;
        var width = ref.width;
        var height = ref.height;
    var padding = (width + height) * 0.05;
    for (var i = this.selector.length;i < this.amount; i++) {
        var sprite = new Sprite(this$1.bitmap);
        sprite.rotation = Math.random();
        sprite.scale = {
            x: 0,
            y: 0
        };
        this$1.layer.add(sprite);
        this$1.ecs.create().add(new Position(padding + Math.random() * (width - padding * 2), padding + Math.random() * (height - padding * 2), Math.random() * 2 * Math.PI), new Velocity(signRandom(3), signRandom(3), signRandom(2) * Math.PI), new Bounty(), sprite, new Transform(this$1.spawnTransform));
    }
};
var Render = function Render(ecs, renderer) {
    this.renderer = renderer;
    this.selector = ecs.select(Position, Sprite);
};
Render.prototype.update = function update () {
    this.selector.iterate(function (entity) {
        var position = entity.get(Position);
        var sprite = entity.get(Sprite);
        sprite.position.x = position.x;
        sprite.position.y = position.y;
        sprite.rotation = position.rotation;
    });
    this.renderer.render();
};

var t$1 = [], n$1 = [], r$1 = {}, e$1 = "_sign", o = "_mask";
Symbol && (e$1 = Symbol(e$1), o = Symbol(o));
var i$1 = function (t, n) {
    var r = n[t];
    if (!r) 
        { throw new Error("The component is not registered"); }
    return r;
}, s = i$1.bind(null, e$1), c = i$1.bind(null, o), a = function (n) {
    n.id && t$1.forEach(function (t) {
        return t.match(n);
    });
}, h = 1, u = function (t) {
    this.id = t || (h++).toString(36), this.components = {}, this.mask = 0;
};
u.prototype.add = function () {
    var arguments$1 = arguments;

    for (var t = this, n = [], r = arguments.length;r--; ) 
        { n[r] = arguments$1[r]; }
    n.forEach(function (n) {
        t.components[s(n.constructor)] = n, t.mask |= c(n.constructor);
    }), a(this);
}, u.prototype.remove = function () {
    var arguments$1 = arguments;

    for (var t = this, n = [], r = arguments.length;r--; ) 
        { n[r] = arguments$1[r]; }
    n.forEach(function (n) {
        var r = s(n), e = t.components[r];
        e && (e.destructor && e.destructor(), delete t.components[r], t.mask &= ~c(n));
    }), a(this);
}, u.prototype.has = function (t) {
    return s(t) in this.components;
}, u.prototype.get = function (t) {
    return this.components[s(t)];
}, u.prototype.eject = function () {
    var n;
    n = this, Object.values(n.components).forEach(function (t) {
        return t.destructor && t.destructor();
    }), t$1.forEach(function (t) {
        return t.remove(n);
    }), delete r$1[n.id], n.id = 0;
};
var f = function (t) {
    var n = this;
    if (!t) 
        { throw new Error("Empty selector"); }
    this.mask = t, this.map = {}, this.list = null, this.length = 0, Object.values(r$1).forEach(function (t) {
        return n.match(t);
    });
};
f.prototype.iterate = function (t) {
    for (var n = this.list;n; ) 
        { t(n.entity), n = n.next; }
}, f.prototype.match = function (t) {
    (this.mask & t.mask) === this.mask ? this.add(t) : this.remove(t);
}, f.prototype.add = function (t) {
    if (!this.map[t.id]) {
        var n = new (function (t, n) {
            this.entity = t, this.prev = null, this.next = n;
        })(t, this.list);
        this.list && (this.list.prev = n), this.list = n, this.map[t.id] = n, this.length++;
    }
}, f.prototype.remove = function (t) {
    var n = this.map[t.id];
    n && (n.prev ? (n.prev.next = n.next) : (this.list = n.next), n.next && (n.next.prev = n.prev), delete this.map[t.id], this.length--);
};
var p = 0, m = performance || Date, l = m.now.bind(m);
var ecs = {
    register: function () {
        var arguments$1 = arguments;

        for (var t = [], n = arguments.length;n--; ) 
            { t[n] = arguments$1[n]; }
        t.forEach(function (t) {
            if (p > 31) 
                { throw new Error("Components limit reached"); }
            t[e$1] || (t[e$1] = p.toString(36), t[o] = 1 << p, p++);
        });
    },
    process: function () {
        var arguments$1 = arguments;

        for (var t = [], r = arguments.length;r--; ) 
            { t[r] = arguments$1[r]; }
        t.forEach(function (t) {
            return n$1.push(t);
        });
    },
    create: function (t) {
        var n = new u(t);
        if (r$1[n.id]) 
            { throw new Error("The ID already exist"); }
        return r$1[n.id] = n, n;
    },
    get: function (t) {
        return r$1[t];
    },
    select: function () {
        var arguments$1 = arguments;

        for (var n = [], r = arguments.length;r--; ) 
            { n[r] = arguments$1[r]; }
        var e = 0;
        n.forEach(function (t) {
            e |= c(t);
        });
        var o = t$1.find(function (t) {
            return t.mask === e;
        });
        if (o) 
            { return o; }
        var i = new f(e);
        return t$1.push(i), i;
    },
    update: function (t) {
        var r = {};
        return n$1.forEach(function (n) {
            var e = l();
            n.update(t), r[n.constructor.name] = l() - e;
        }), r;
    }
};

var stats = new Stats();
document.body.appendChild(stats.dom);
var view = document.getElementById('view');
var renderer = i(view);
console.log(renderer);
renderer.bkg(0.2, 0.2, 0.2, 1);
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
    for (var angle = 0;angle < Math.PI * 2; angle += Math.PI * 2 / 5) {
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
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offset + 3, 3, offset + 28, 28);
    return canvas;
};
var atlas = renderer.texture(atlasImg());
var bountyBitmap = renderer.bitmap(atlas, 0, 0, 31, 31);
var hunterBitmap = renderer.bitmap(atlas, 32, 0, 63, 31);
var particleBitmap = renderer.bitmap(atlas, 70, 10, 72, 12);
var huntersCount = 1 + view.width * view.height / 100000 * 2 | 0;
var particleLayer = renderer.layer(0);
ecs.register(Position, Velocity, Sprite, Bounty, Hunter, Transform);
ecs.process(new Transformer(ecs), new Spawner(ecs, renderer, huntersCount * 2, bountyBitmap), new AI(ecs, particleBitmap, particleLayer), new Exhaust(ecs, particleBitmap, particleLayer), new Movement(ecs), new Render(ecs, renderer));
var hunterLayer = renderer.layer(3);
Array.apply(void 0, Array(huntersCount)).forEach(function () {
    ecs.create().add(new Position(Math.random() * view.width, Math.random() * view.height, Math.random() * 2 * Math.PI), new Velocity(), new Hunter(), new Sprite(hunterBitmap, hunterLayer));
});
var spritesSel = ecs.select(Sprite);
var sprites = document.getElementById('sprites');
var i$2 = 0;
var last = 0;
var loop = function () {
    stats.begin();
    var now = (performance || Date).now();
    var statistics = ecs.update((now - last || now) / 1000);
    last = now;
    stats.end();
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
