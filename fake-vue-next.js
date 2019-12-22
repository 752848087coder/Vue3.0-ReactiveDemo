/**
 * @file fake-vue-next
 * @author gavinwu
 */

(global => {
    // targetMap可以理解为vue2.x的 Dep, 负责记录所有target的依赖
    const targetMap = new WeakMap();
    // Symbol创建一个唯一值ITERATE_KEY，作为target一个特殊的key，我们去循环我们的代理对象时，
    // ITERATE_KEY 会收集依赖，当我们的代理对象有新增Key或删除Key时触发依赖
    const ITERATE_KEY = Symbol('iterate');
    // 当前正在处理的依赖
    let activeEffect = null;

    // getter触发时收集依赖
    const track = (target, type, key) => {
        if (!activeEffect) {
            return;
        }
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            depsMap = new Map();
            targetMap.set(target, depsMap);
        }
        let dep = depsMap.get(key);
        if (!dep) {
            deps = new Set();
            depsMap.set(key, deps);
            console.log(targetMap)
        }
        deps.add(activeEffect);
        activeEffect.deps.push(deps);
        activeEffect.options.onTrack({
            effect: activeEffect,
            target,
            type,
            key
        });
    };

    // setter触发时触发依赖
    const trigger = (target, type, key) => {
        const depsMap = targetMap.get(target);
        if (depsMap) {
            if (type === 'add' || type === 'delete') {
                key = ITERATE_KEY;
            }
            const deps = depsMap.get(key);
            if (deps) {
                deps.forEach(effect => {
                    effect.options.onTrigger(effect, target, type, key);
                    effect();
                });
            }
        }
    };

    // key被读取时触发
    function get(target, key, receiver) {
        const res = Reflect.get(target, key);
        track(target, 'get', key);
        return typeof res === 'object' ? reactive(res) : res;        
    }

    // key被设置时触发
    function set(target, key, value, receiver) {
        const hadKey = Object.prototype.hasOwnProperty.call(target, key);
        const res = Reflect.set(target, key, value);
        trigger(target, hadKey ? 'set': 'add', key);
        return res;      
    }

    // key被删除时触发
    function deleteProperty(target, key) {
        const hadKey = Object.prototype.hasOwnProperty.call(target, key);
        let result = Reflect.deleteProperty(target, key);
        if (result && hadKey) {
            trigger(target, 'delele', key);
        }
        return result;
    }

    // key被循环时触发
    function ownKeys(target) {
        // 收集ITERATE_KEY的依赖
        track(target, 'iterate', ITERATE_KEY);
        return Object.keys(target);
    }

    // reactive可以理解为vue2.x的Observer，负责将复杂对象转换成响应式数据
    const reactive = (target) => {
        // Proxy实现target的代理
        return new Proxy(target, {
            get,
            set,
            deleteProperty,
            ownKeys
        });
    };

    // effect可以理解为vue2.x的Watcher, 即依赖
    const effect = (fn, options) => {
        const effect = () => {
            activeEffect = effect;
            const res = fn();
            activeEffect = null;
            return res;
        };
        effect.deps = [];
        effect.options = options;
        effect();
        return effect;
    };

    global.fakevue = {
        reactive,
        effect
    };

})(window);