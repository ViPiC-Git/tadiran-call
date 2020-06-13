/* 0.0.1 �������� ������ �� url ����� tel

wscript caller.min.js <action> [<number>]

<action>            - �������� ������� ����� ���������
    reg             - ���������������� ������ ��� ����������
    unreg           - ������� ����������� ������� �� ������������
    call            - ��������� ����� ������
<number>            - ���������� ����� ��� url ��� ������

*/

var caller = new App({
    login: "admin",         // ��� ������������ ��� ����������� � ��������
    password: "admin"       // ������ ��� ����������� � ��������
});

// ���������� ��������� �������� ����������
(function (app, wsh, undefined) {// �������� ����� �� �������� ���������� �������
    app.lib.extend(app, {// ��������� ������� ���������� ����������

        /**
         * ��������� ����� ������ ��� �������� ����������� �����������.
         * @param {string} action - �������� ������� ����� ���������.
         * @param {string} [number] - ���������� ����� ��� url ��� ������.
         * @returns {number} ����� ������ ��� ����.
         */

        action: function (action, number) {
            var value, data, shell, system, locator, service, response, item, items, ip, token,
                delim, flag, list, user, xhr, id = "call", link = "http://tl", error = 0;

            shell = new ActiveXObject("WScript.Shell");
            // ������������ ����� ��� ������
            if (!error && number) {// ���� ����� ���������
                value = app.lib.strim(number, ":", null, false, false);
                number = !value.indexOf("+7") ? "8" + value.substr(2) : value;
            };
            // ��������� ��������������� ������
            if (!error) {// ���� ���� ������
                delim = "\\";// ����������� �����
                data = {// ��������� ������
                    root: "HKEY_CLASSES_ROOT",
                    machine: "HKEY_LOCAL_MACHINE",
                    title: "������������ �������",
                    original: "URL:Tel Protocol",
                    protocol: "tel",
                    type: "REG_SZ",
                    name: "Caller"
                };
            };
            // ��������� ����������� �����������
            if (!error && "reg" == action) {// ���� ����� ���������
                try {// ������� ��������� ��������
                    value = '"' + wsh.fullName + '" "' + wsh.scriptFullName + '" ' + id + ' "%1"';
                    shell.regWrite([data.root, data.name, ""].join(delim), data.title, data.type);
                    shell.regWrite([data.root, data.protocol, ""].join(delim), data.title, data.type);
                    shell.regWrite([data.root, data.name, "shell", "open", "command", ""].join(delim), value, data.type);
                    shell.regWrite([data.machine, "SOFTWARE", data.name, "Capabilities", "URLAssociations", data.protocol].join(delim), data.name, data.type);
                    shell.regWrite([data.machine, "SOFTWARE", "RegisteredApplications", data.name].join(delim), ["Software", data.name, "Capabilities"].join(delim), data.type);
                } catch (e) { error = 1; };
            };
            // ������� ����������� �����������
            if (!error && "unreg" == action) {// ���� ����� ���������
                try {// ������� ��������� ��������
                    shell.regWrite([data.root, data.name, ""].join(delim), data.original, data.type);
                    shell.regWrite([data.root, data.protocol, ""].join(delim), data.original, data.type);
                    try { shell.regDelete([data.root, data.name, "shell", "open", "command", ""].join(delim)); } catch (e) { };
                    try { shell.regDelete([data.root, data.name, "shell", "open", ""].join(delim)); } catch (e) { };
                    try { shell.regDelete([data.root, data.name, "shell", ""].join(delim)); } catch (e) { };
                    try { shell.regDelete([data.root, data.name, ""].join(delim)); } catch (e) { };
                    try { shell.regDelete([data.machine, "SOFTWARE", data.name, "Capabilities", "URLAssociations", ""].join(delim)); } catch (e) { };
                    try { shell.regDelete([data.machine, "SOFTWARE", data.name, "Capabilities", ""].join(delim)); } catch (e) { };
                    try { shell.regDelete([data.machine, "SOFTWARE", data.name, ""].join(delim)); } catch (e) { };
                    try { shell.regDelete([data.machine, "SOFTWARE", "RegisteredApplications", data.name].join(delim)); } catch (e) { };
                } catch (e) { error = 2; };
            };
            // ��������� ���������� ������
            if (id == action && number) {// ���� ����� ��������� ������
                // �������� wmi ������ ��� ��������������
                if (!error) {// ���� ���� ������
                    locator = new ActiveXObject("wbemScripting.Swbemlocator");
                    locator.security_.impersonationLevel = 3;// impersonate
                    try {// ������� ������������ � ������� ��������
                        service = locator.connectServer(".", "root\\CIMV2");
                    } catch (e) { error = 3; };
                };
                // �������� ip ����� ����������
                if (!error) {// ���� ���� ������
                    response = service.execQuery(
                        "SELECT *" +
                        " FROM Win32_NetworkAdapterConfiguration" +
                        " WHERE ipEnabled = TRUE"
                    );
                    items = new Enumerator(response);
                    while (!items.atEnd()) {// ���� �� ��������� �����
                        item = items.item();// �������� ��������� ������� ���������
                        items.moveNext();// ��������� � ���������� ��������
                        // �������� ����� 
                        if (null != item.ipAddress) {// ���� ���� ������ ip �������
                            list = item.ipAddress.toArray();// �������� ��������� ������
                            for (var i = 0, iLen = list.length; i < iLen && !ip; i++) {
                                value = list[i];// �������� ��������� ��������
                                if (value && ~value.indexOf('.')) ip = value;
                            };
                        };
                        // ��������������� �� ������ ��������
                        break;
                    };
                    if (ip) {// ���� ���� ip ����� ����������
                    } else error = 4;
                };
                // ���������� ���������� ����� ������������
                if (!error) {// ���� ���� ������
                    system = new ActiveXObject("ADSystemInfo");
                    try {// ������� ������������ � ������� ��������
                        user = GetObject("LDAP://" + system.userName);
                        value = user.get("telephoneNumber");
                    } catch (e) { error = 5; };
                };
                // ��������� ����� ��� ����������� � ��������
                if (!error) {// ���� ���� ������
                    if (value) {// ���� ���� ���������� �����
                        link += value;
                    } else error = 6;
                };
                // �������� ����������� �� ��������
                if (!error) {// ���� ���� ������
                    data = {// ������ ��� �������
                        username: app.val.login,
                        pwd: app.val.password,
                        jumpto: "features-remotecontrl"
                    };
                    xhr = app.lib.sjax("post", link + "/servlet?p=login&q=login", false, data);
                    if (200 == xhr.status) {// ���� ������ �������� �������
                        value = xhr.responseText;
                    } else error = 7;
                };
                // ������������ ������ ����������� ip �������
                if (!error) {// ���� ���� ������
                    delim = ",";// ����������� ��������
                    flag = true;// ����� �� ip ����� ���������� �������� � �����������
                    token = app.lib.strim(value, 'g_token = "', '"', false, false);
                    value = app.lib.strim(value, 'name="AURILimitIP"', '>', false, false);
                    list = app.lib.strim(value, 'value="', '"', false, false).split(delim);
                    for (var i = 0, iLen = list.length; i < iLen && flag; i++) {
                        value = list[i];// �������� ��������� ��������
                        if (value == ip) flag = false;
                    };
                    if (token) {// ���� ������� �������� �����
                    } else error = 8;
                };
                // ��������� ip ����� ���������� � �����������
                if (!error && flag) {// ���� ����� ���������
                    list.push(ip);// ��������� ip ����� � ������
                    data = {// ������ ��� �������
                        "AURILimitIP": list.join(delim),
                        "token": token
                    };
                    xhr = app.lib.sjax("post", link + "/servlet?p=features-remotecontrl&q=write", false, data);
                    if (200 == xhr.status) {// ���� ������ �������� �������
                    } else error = 9;
                };
                // ��������� ������
                if (!error) {// ���� ���� ������
                    xhr = app.lib.sjax("get", link + "/servlet?p=contacts-callinfo&q=call&acc=0&num=" + number, true);
                    if ("call success" == xhr.responseText) {// ���� ������ �������� �������
                    } else error = 10;
                };
            };
            // ���������� ����������
            list = [];// �������� ������ ��������
            list[1] = "��������� ���������������� �������� ��� �������.";
            list[2] = "��������� ������� ����������� ��������� ��� �������.";
            if (value = list[error]) wsh.echo(value);
            // ���������� ���������
            return error;
        },
        init: function () {// ������� ������������� ����������
            var value, list = [], index = 0, error = 0;

            // ��������� ������ ���������� ��� ������ ��������
            if (!error) {// ���� ���� ������
                for (var i = index, iLen = wsh.arguments.length; i < iLen; i++) {
                    value = wsh.arguments(i);// �������� ��������� ��������
                    list.push(value);// ��������� �������� � ������
                };
            };
            // ��������� �������������� ��������
            if (!error) error = app.action.apply(app, list);
            // ��������� �������� �����
            wsh.quit(error);
        }
    });
})(caller, WSH);

// �������������� ����������
caller.init();