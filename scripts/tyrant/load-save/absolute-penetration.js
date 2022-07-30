function save_absolute_penetration_attacker_data() {
    attacker_data = save_base_attacker_data()
    attacker_data["luk_passive_lvl"] = giv("i_luk-passive-lvl")
    attacker_data["crackshot_lvl"] = giv("i_crackshot-lvl")
    attacker_data["abs_pen_lvl"] = giv("i_abs-pen-lvl")
    attacker_data["aesir_mod"] = gi("i_aesir-mod").selectedIndex
    attacker_data["distance_metres"] = giv("i_distance-metres")
    attacker_data["charging_time"] = giv("i_charging-time")

    return attacker_data
}

function capture_attacker_data() {
    attacker_data = save_absolute_penetration_attacker_data()
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
    elem_set_value(attacker_data["luk_passive_lvl"], "i_luk-passive-lvl")
    elem_set_value(attacker_data["crackshot_lvl"], "i_crackshot-lvl")
    elem_set_value(attacker_data["abs_pen_lvl"], "i_abs-pen-lvl")
    elem_set_selected_index(attacker_data["aesir_mod"], "i_aesir-mod")
    elem_set_value(attacker_data["distance_metres"], "i_distance-metres")
    elem_set_value(attacker_data["charging_time"], "i_charging-time")

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