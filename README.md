# ��������
`JScript` ��� ������ ������ �� ��������� `Tadiran` �� **url** ����� `tel` � ��������.
# �������������
� ��������� ������ **Windows** ������� ��������� �������:
```
wscript caller.min.js <action> [<number>]
```
- `<action>` - �������� ������� ����� ���������.
- `<number>` - ���������� ����� ��� url ��� ������.
## �������������� ��������
- `reg` - ���������������� ������ ������ ��� ���������� ��������� `tel`.
- `unreg` - ������� ����������� ������� �� ������������ ��������� `tel`.
- `call` - ��������� ����� ������ ����������� � �������� `<number>`.
# ������� �������������
���������������� ������ ������ ��� ���������� ��������� `tel`.
```
wscript caller.min.js reg
```
��������� ����� ������ `+71234567890`.
```
wscript caller.min.js call +71234567890
```