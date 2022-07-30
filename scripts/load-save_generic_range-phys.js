function save_generic_range_attacker_data() {
    attacker_data = save_base_attacker_data()
    attacker_data["skill_mod_per"]=giv("i_skill-mod-per")

    return attacker_data
}

function capture_attacker_data() {
    attacker_data = save_generic_range_attacker_data()
    base64_string = save_as_base64(attacker_data)

    gi("attacker_data_box").value = base64_string
}

function load_attacker_data() {
    base64_attacker_data = giv("attacker_data_box")

    if (base64_attacker_data == null) {
        return;
    }

    base64_attacker_data = base64_attacker_data.trim()
    if (base64_attacker_data == "") {
        return;
    }

    attacker_data = load_from_base64(base64_attacker_data)

    load_base_attacker_data(attacker_data)
    elem_set_value(attacker_data["skill_mod_per"], "i_skill-mod-per")

    update_all()
}

function save_generic_range_defender_data() {
    defender_data = save_base_defender_data()
    return defender_data
}

function capture_defender_data() {
    defender_data = save_generic_range_defender_data()
    base64_string = save_as_base64(defender_data)

    gi("defender_data_box").value = base64_string
}

function load_defender_data() {
    base64_defender_data = giv("defender_data_box")

    if (base64_defender_data == null) {
        return;
    }

    base64_defender_data = base64_defender_data.trim()
    if (base64_defender_data == "") {
        return;
    }

    defender_data = load_from_base64(base64_defender_data)

    load_base_defender_data(defender_data)

    update_all()
}