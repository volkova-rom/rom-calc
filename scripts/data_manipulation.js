function as_modifier(val) {
    var float_val = parseFloat(val)
    return parseFloat((float_val / 100.00).toFixed(4))
}

function standard_float(val) {
    return parseFloat(parseFloat(val).toFixed(4));
}

function save_as_base64(dict) {
    json_string = JSON.stringify(dict)
    return btoa(json_string)
}

function load_from_base64(base64_string) {
    json_string = atob(base64_string)
    return JSON.parse(json_string)
}

function handle_input_element_retrieval(input_element) {
    var input_type = input_element.type;
    var input_value = input_element.value;

    if(input_type == null) {
        return input_value;
    }

    if(input_type == "number") {
        return standard_float(input_value);
    }

    if(input_type == "checkbox") {
        return input_element.checked;
    }

    return input_value;
}

function handle_select_element_retrieval(select_element) {
    return select_element == null ? 0 : parseInt(select_element.selectedIndex);
}

function infer_element_value(element) {
    if(element == null) {
        return null;
    }

    var tag_name = element.tagName;
    if(tag_name == null) {
        return null;
    }

    tag_name = tag_name.toLowerCase();

    if(tag_name == "input") {
        return handle_input_element_retrieval(element);
    }

    if(tag_name == "select") {
        return handle_select_element_retrieval(element);
    }

    return element.value;
}

function retrieve_all_elements_by_class(class_name, with_prefix) {
    var elements = document.getElementsByClassName(class_name);

    var element_dict = {
        "dict_class": class_name,
        "dict_keys_have_prefix": with_prefix
    };

    for(var element of elements) {
        if(element == null) {
            continue;
        }

        var key = element.id;
        if(key == null) {
            continue;
        }

        key = key.trim();
        if(key == "") {
            continue;
        }

        if(!key.startsWith(class_name)) {
            continue;
        }

        key = with_prefix ? key : key.substring(class_name.length + 1);
        var element_value = infer_element_value(element);

        if(element_value == null) {
            continue;
        }
        element_dict[key] = element_value;
    }

    return element_dict;
}

function handle_input_element_update(input_element, input_value) {
    var input_type = input_element.type;

    if(input_type == null) {
        input_element.value = input_value;
        return;
    }

    if(input_type == "checkbox") {
        input_element.checked = input_value;
        return;
    }

    input_element.value = input_value;
}


function infer_element_update(element_id, element_value) {
    var element = document.getElementById(element_id);

    if(element == null) {
        return;
    }

    var tag_name = element.tagName;
    if(tag_name == null) {
        return;
    }

    tag_name = tag_name.toLowerCase()

    if(tag_name == "select") {
        element.selectedIndex = parseInt(element_value);
        return;
    }

    if(tag_name == "input") {
        handle_input_element_update(element, element_value);
        return;
    }

    if(tag_name == "span") {
        element.textContent = element_value;
        return;
    }

    element.value = element_value;
}

function update_all_elements_in_class(element_dict) {
    if(element_dict == null) {
        return;
    }

    var class_name = element_dict["dict_class"];
    if(class_name == null) {
        return;
    }

    var has_prefix = element_dict["dict_keys_have_prefix"];

    for(var element_key in element_dict) {
        var key = has_prefix ? element_key : class_name + "." + element_key.toString();
        var value = element_dict[element_key];
        infer_element_update(key, value);
    }
}

function ratio_entries(dict) {
    var ratio_previous = 1.00;
    var ratio_dict = {};
    for(var key in dict) {
        if(!key.startsWith("ratio_")) {
            continue;
        }
        if(key == "ratio_previous") {
            ratio_previous = dict[key];
            continue;
        }
        ratio_dict[key] = dict[key];
    }
    var updated_ratio_dict = {};
    for(var ratio_key in ratio_dict) {
        var ratio_value = ratio_dict[ratio_key];
        updated_ratio_dict[ratio_key] = standard_float(ratio_previous * ratio_value);
    }
    return updated_ratio_dict;
}

function update_as_computed(dict) {
    var dict_copy = {...dict};
    dict_copy["dict_class"] = "computed"
    dict_copy["dict_keys_have_prefix"] = false;

    update_all_elements_in_class(dict_copy);
}

function update_duplicates() {
    var attacker_data = retrieve_all_elements_by_class("attacker", true);
    var defender_data = retrieve_all_elements_by_class("defender", true);
    var all_data = {
        ...attacker_data,
        ...defender_data
    }

    var duplicates = document.getElementsByClassName("duplicate");

    for(duplicate_element of duplicates) {
        var duplicate_source = duplicate_element.title;

        if(duplicate_source == null) {
            continue;
        }

        if(duplicate_source in all_data) {
            duplicate_element.textContent = all_data[duplicate_source];
        }        
    }
}

function display_generic_tier(tier_data) {
    var base_value = tier_data["base_value"];
    var total_modifiers = tier_data["total_modifiers"];
    var total_value = tier_data["total_value"];

    return `base=${base_value} * total_modifiers=${total_modifiers} = ${total_value}`;
}

function standard_capture_attacker_data() {
    var attacker_data_box = document.getElementById("attacker_data_box");
    if(attacker_data_box == null) {
        return;
    }

    var attacker_data = retrieve_all_elements_by_class("attacker", false);
    var attacker_data_base64_string = save_as_base64(attacker_data);

    attacker_data_box.value = attacker_data_base64_string;
}

function standard_load_attacker_data() {
    var attacker_data_box = document.getElementById("attacker_data_box");
    if(attacker_data_box == null) {
        return;
    }

    var attacker_data_base64_string = attacker_data_box.value;
    if(attacker_data_base64_string == null) {
        return;
    }

    attacker_data_base64_string = attacker_data_base64_string.trim();
    if(attacker_data_base64_string == "") {
        return;
    }

    var attacker_data = load_from_base64(attacker_data_base64_string);
    update_all_elements_in_class(attacker_data);
    document.getElementById("attacker_data_box").value = null;
}

function standard_capture_defender_data() {
    var defender_data_box = document.getElementById("defender_data_box");
    if(defender_data_box == null) {
        return;
    }

    var defender_data = retrieve_all_elements_by_class("defender", false);
    var defender_data_base64_string = save_as_base64(defender_data);

    defender_data_box.value = defender_data_base64_string;
}

function standard_load_defender_data() {
    var defender_data_box = document.getElementById("defender_data_box");
    if(defender_data_box == null) {
        return;
    }

    var defender_data_base64_string = defender_data_box.value;
    if(defender_data_base64_string == null) {
        return;
    }

    defender_data_base64_string = defender_data_base64_string.trim();
    if(defender_data_base64_string == "") {
        return;
    }

    var defender_data = load_from_base64(defender_data_base64_string);
    update_all_elements_in_class(defender_data);

    document.getElementById("defender_data_box").value = null;
}
