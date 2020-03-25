/**
 * @file fake-vue-next
 * @author Gavin Wu
 */

const {reactive, effect} = window.fakevue;

let originPerson = {
    name: 'Gavin Wu',
    age: 25,
    skill: ['Vue', 'Node.js', 'Java', 'Python']
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

const handleChangeName = (e) => {
    person.name = e.target.value;
};

const handleChangeAge = (e) => {
    person.age = e.target.value;
};

const handleChangeSkill = (e) => {
    let index = person.skill.indexOf(e.target.value);
    index >= 0 ? person.skill.splice(index, 1): person.skill.push(e.target.value);
};