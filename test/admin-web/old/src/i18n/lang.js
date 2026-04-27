import diction from './diction'

let { dict, lang_order } = diction
let output_dicts = {}
for (let lang in lang_order) {
    if (lang == 0) continue

    let dd = {}
    for (let key in dict) {
        let d = {}
        dict[key].forEach(item => {
            d[item[0]] = item[lang]
        })
        dd[key] = d
    }
    output_dicts[lang_order[lang]] = dd
}
export default output_dicts