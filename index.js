/**
 * @file fake-vue-next
 * @author gavinwu
 */

const {reactive, effect} = window.fakevue;

let originPerson = {
    name: 'gavinwu',
    age: 25,
    skill: ['vue', 'js', 'java', 'python']
};

let person = reactive(originPerson);

// effect(fn, options)
// fn中读取的Key会收集依赖，当key被设置时触发，并再次执行fn
effect(() => {
    var html = '';
    Object.keys(person).forEach(key => {
        html += `<p>${key} ----> ${JSON.stringify(person[key])}</p>`;
    });
    document.getElementById('template').innerHTML = html;
}, {
    onTrack(effect, target, key, type) {
        // key被读取时的回调
        console.log(...arguments);
    },
    onTrigger(effect, target, key, type) {
        // key被设置时的回调
        console.log(...arguments);
    }
});

const changeName = () => {
    person.name = 'change';
};

const changeSkill = () => {
    person.skill[0] = 'change';
};

const addKey = () => {
    person['newKey'] = 'newVal';
};

const deleteKey = () => {
    let keys = Object.keys(person);
    if (keys.length) {
        const lastKey = keys[keys.length - 1];
        delete person[lastKey];
    }
};