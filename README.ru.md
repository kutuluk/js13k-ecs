# js13k-ecs

[![NPM version](https://img.shields.io/npm/v/js13k-ecs.svg?style=flat-square)](https://www.npmjs.com/package/js13k-ecs)

> Микроскопическая объектно-ориентированная [Entity Component System](https://en.wikipedia.org/wiki/Entity_component_system) созданная специально для конкурса [Js13kGames](https://js13kgames.com/).

Cпроектирована не для обеспечения высокой производительности (но, тем не менее, достаточно быстра), в первую очередь нацелена на достижение следующих целей:

- Легковесность (~650b minzipped)
- Простое, лаконичное и гибкое API в традиционном стиле javascript
- Эффективная минификация итогового пользовательсткого кода

## Install

```sh
$ npm i js13k-ecs
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/js13k-ecs/dist/ecs.umd.js"></script>
```

You can find the library on `window.ecs`.

## Usage

```javascript
import ecs from 'js13k-ecs';

class Vector {
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }
}

class Position extends Vector {}
class Velocity extends Vector {}

ecs.register(Position, Velocity);

ecs.create().add(new Position(), new Velocity(1, 1));

class MovementSystem {
    constructor(ecs) {
        this.query = ecs.query(Position, Velocity);
    }

    update(delta) {
        this.query.iterate((entity, [position, velocity]) => {
            position.x += velocity.x * delta;
            position.y += velocity.y * delta;
        });
    }
}

const pipeline = [new MovementSystem(ecs)];

let last = performance.now();

const loop = () => {
    const now = performance.now();
    const delta = now - last;
    last = now;

    ecs.update(pipeline, delta);
    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
```

See full demo in example folder. [Live demo](https://kutuluk.github.io/js13k-ecs/)

## API

### ecs

#### `ecs.register(Class1, ..., ClassN)`

Метод регистрирует классы javascript для использования в качестве компонентов. Ни каких требований для классов нет, они могут содержать любые данные и иметь любые методы. Если класс содержит метод `destructor`, то он будет вызываться при удалении компонента из сущности.

#### `ecs.create()`

Метод создает и возвращает пустую сущность.

#### `ecs.query(Class1, ..., ClassN)`

Метод возвращает набор сущностей, содержащих компоненты всех заданных классов. Набор обновляется автоматически и всегда актуален.

Набор имеет свойство `length`, которое хранит количество сущностей в наборе и метод `iterate(iteratorFunction [, skipComponentsFlag])`, позволяющий перебрать все сущности из набора.

```javascript
class MovementSystem {
    constructor(ecs) {
        this.query = ecs.query(Position, Velocity);
    }

    update(delta) {
        const movement = (entity, [position, velocity]) => {
            position.x += velocity.x * delta;
            position.y += velocity.y * delta;
            position.rotation += velocity.rotation * delta;
        };

        this.query.iterate(movement);
    }
}
```

В этом примере сущности набора итерируется с помощью функции `movement`, которая применится для каждой сущности у которой одновременно имеется и компонент `Position`, и компонент `Velocity`. Первым параметром в эту функцию приходит сама сущность, вторым параметром приходит массив компонентов в том же порядке, в котором они заданы при создании набора. Если набор состоит из одного компонента, то вторым параметром придет не массив, а заданный компонент.

Автоматическое извлечение компонентов полезно для более компактного кода, но бывают случаи когда этого не требуется. Если в метод `iterate` вторым параметром передать `true`, то компоненты не будут автоматически извлекаться из сущности, тогда необходимые компоненты можно будет получить вручную с помощью метода `entity.get()`.

Запросы являются основным способом реализации систем. Обычно запрос создается при создании системы и используется в методе `update`.

#### `ecs.update(pipeline, arg1, ..., argN)`

Метод последовательно запускает метод `update` каждой системы из массива систем `pipeline`, передавая в него заданные параметры. Это оптимальный способ апдейта мира для продакшн-билда. В тоже время, апдейт мира можно произвести и без использования этого метода путем ручного вызова нужных систем. Вот пример кода, запускающего системы и собирающего информацию о времени выполнения каждой из них:

```javascript
const pipeline = [new TargetingSystem(ecs), new MovementSystem(ecs)];

let last = performance.now();

const loop = () => {
    const now = performance.now();
    const delta = now - last;
    last = now;

    const statistics = {};

    pipeline.forEach((system) => {
        const begin = performance.now();
        system.update(delta);
        statistics[system.constructor.name] = performance.now() - begin;
    });

    console.log(statistics);

    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
```

В качестве системы может выступать любой класс или объект с методом `update`, аргументы которого строго не определены и задаются разработчиком при вызове `ecs.update`. Это позволяет гибко настраивать поведение библиотеки в зависимости от нужд приложения. Как правило, этот метод принимает как минимум один аргумент `delta`, определяющий сколько времени прошло с момента последнего обновления мира.

#### `ecs.reset()`

Удаляет из мира все сущности и их компоненты.

### `Entity`

Сущности в данной реализации ecs не имеют id, при необходимости передаются по ссылке и несут в себе все необходимые методы для добавления, извлечения и удаления компонентов. А так же метод для удаления сущности из мира (с удалением всех компонентов).

#### `entity.add(component1, ..., componentN)`

Метод добавляет компоненты к сущности. Метод ожидает инстансы ранее зарегистрированных классов. В случае, если передаваемый компонент уже присутствует в сущности, то старый компонент будет удален (с вызовом деструктора при его наличии) и заменен новым. Возвращает саму сущность.

#### `entity.get(Class1, ..., ClassN)`

Метод возвращает заданные компоненты сущности. Метод ожидает ранее зарегистрированные классы. Если запрошено больше одного компонента, метод возвращает массив компонентов в том же порядке, иначе сам запрошенный компонент. В случае отсутствия у сущности запрошенного компонента вместо него возвращается `undefined`.

#### `entity.remove(Class1, ..., ClassN)`

Метод удаляет компоненты из сущности. Метод ожидает ранее зарегистрированные классы. При наличии у компонента диструктора вызывает его перед удалением. Возвращает саму сущность.

#### `entity.delete()`

Метод удаляет сущность из мира, предварительно очистив ее от компонентов с вызовом их деструкторов.

#### `entity.exists`

Свойство служит для определения, находится ли сущность в мире или уже удалена из него. Если сущность удалена, возвращает `null`, иначе возвращает саму сущность. При сохранении ссылкок на сущности этот свойство следует всегда проверять перед операциями над ними. Следует иметь в виду, что такую проверку нет необходимости делать для сущностей, получаемых из запросов - там сущности гарантированно актуальны.

```javascript
class TargetingSystem {
    constructor(ecs) {
        this.query = ecs.query(Unit);
    }

    update(delta) {
        this.query.iterate((entity, unit) => {
            if (!unit.target?.exists) {
                // unit.target не задан, либо сущность, на которую указывает таргет потеряла актуальность
                // найти новый таргет
                // ...
            }
        });
    }
}
```
