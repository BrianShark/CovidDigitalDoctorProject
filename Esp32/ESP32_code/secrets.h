#include <pgmspace.h>

#define SECRET
#define THINGNAME  "MyESP32"                                       //change this

const char WIFI_SSID[] = "KingsLanding";                                        //change this
const char WIFI_PASSWORD[] = "bunanbhaile";                                    //change this
const char AWS_IOT_ENDPOINT[] = "a31tdkejw9fn0n-ats.iot.us-east-1.amazonaws.com";        //change this

// Amazon Root CA 1
static const char AWS_CERT_CA[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
rqXRfboQnoZsG4q5WTP468SQvvG5
-----END CERTIFICATE-----
)EOF";

// Device Certificate                                               //change this
static const char AWS_CERT_CRT[] PROGMEM = R"KEY(
-----BEGIN CERTIFICATE-----
MIIDWTCCAkGgAwIBAgIUeLcigvTfjDKzjFBTnkBfcBCzDlowDQYJKoZIhvcNAQEL
BQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20g
SW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTIxMDgxOTA5NDAz
MVoXDTQ5MTIzMTIzNTk1OVowHjEcMBoGA1UEAwwTQVdTIElvVCBDZXJ0aWZpY2F0
ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALTLwrvh3OUzhaC0s3iZ
lVc7InvjzusLgWEmZrGW3oAkekLJuPwrCRNtxwCn/JbzlGInmS+UxKIKGs6ux59k
NELigjxbZ/2fEIfxGn6/sJeb1BcI+aVCI1KkQ0XvQ/LXoDWnThkE2TiBmTzdO3cs
jU+lrq6mPMXwViOHmdVaULQNlJJDBPZjoU1pKDjz/u/tIoCnY8sdHG48k+8SYP3p
htrB/ASUV7AgJWLSVU0HquzGQIq10TUKJ0vXgGWmvVxH5Orf+NkfMXRZVI+sl1lr
K2fJ4ilOLPo7DYhSaIoejbLrgnGv+FbWdncosJ8RAnHXvZEHZhscrhUFdUSA0VbP
EKcCAwEAAaNgMF4wHwYDVR0jBBgwFoAUJNMbzgi8RGAqtpGbZiU7e2bj7V0wHQYD
VR0OBBYEFG2G0Pc4xKzUi4o+Ifa87/pxn5kJMAwGA1UdEwEB/wQCMAAwDgYDVR0P
AQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQAgBF44zLvxUtclnRxFH930rT3x
8yOE1tmhv6XcWEQi1B9mk/+fejCvDWEdenA7IDj2VTdckPBAfItU29Pbb1JesmQX
7dq+U4cv1hsME+4cT9UTv8xB8dZC2gcQ4Udo89J0b753uzjx58uTwJD4H23hAtO6
p2c/jK6avsoybu7zGFWcc2pAcRQCHQ0Msem+lCkZwOpI/X2PN6shhx8gzpExPMsS
3+aYX+JQw8nKMOEjV6obgBIpW2OljP0jDOr/03U0Ec7f/CLTHi2/62V/XyxXWRfJ
LLoCCSDiNUt6/7U6l+nPH7qgs5SediHeOG83edE5EUEtG6FVxdsdp8yJQuue
-----END CERTIFICATE-----

)KEY";

// Device Private Key                                               //change this
static const char AWS_CERT_PRIVATE[] PROGMEM = R"KEY(
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAtMvCu+Hc5TOFoLSzeJmVVzsie+PO6wuBYSZmsZbegCR6Qsm4
/CsJE23HAKf8lvOUYieZL5TEogoazq7Hn2Q0QuKCPFtn/Z8Qh/Eafr+wl5vUFwj5
pUIjUqRDRe9D8tegNadOGQTZOIGZPN07dyyNT6WurqY8xfBWI4eZ1VpQtA2UkkME
9mOhTWkoOPP+7+0igKdjyx0cbjyT7xJg/emG2sH8BJRXsCAlYtJVTQeq7MZAirXR
NQonS9eAZaa9XEfk6t/42R8xdFlUj6yXWWsrZ8niKU4s+jsNiFJoih6NsuuCca/4
VtZ2dyiwnxECcde9kQdmGxyuFQV1RIDRVs8QpwIDAQABAoIBAFOdoVSPo0AF0hl/
OTnfnigX21z9ASfHzHCH+BrOMd2GAV1+OiW2KZ5ouQ7eon2V7dxvf/N3lHF0xu0r
/HsFNv5wD9emVrP/qv+UTLKuKRgVI8P7jKoXqoqAGfTwMbbQbvIhjIcZrPTrS1nQ
373ARyK898siax0IiG4qOsVn3cdHcYQ54X4Xzt/sMdW4Znd9TbQXs2KXhZoa6THX
Uc8/NcZ4rOnHc3EZyjBhSXqHOjnSEPT1xQ6x+xvAC0yQc/21jb19kAEVinJyGgiS
aLbiBqnNL4gDT9pKIw48T/wqaFlfCCSE14tg34WpBh/6eKZNO38FkcDIa/EK+wYx
9MdQ13ECgYEA3gUhvk7s/21JoMhwnr4cf75EJc+xhW3GpG7pAaXhoxrhPErqQpKF
KRWGq6jCywkpJLMx7ZPXGAiRdB0ZHNxG0kXxkKlOvDmika+4eo1wlMrvJdtmP7xj
dz00l4yyVEzIEbGwyog0n3gNenLBvQqwHnyqZpf9SiKQ8qQVbwOiMMUCgYEA0Hdy
EsdYQIueqUIbyq70Jlqf2v3pox3ZQA2CrxqI79AszWvBP4bvKjrr3mFjHznHJYvQ
w9oIW6a1MHG9ATBpknVEgqa4wyLKQCzCHivI4PCBZhf/AKMX85oxnLAarn86fEHf
N/DI1gvJpDMprkvkUy5ePddUDc1EjZATlmjROnsCgYBEGYLeIstjFZyN6q1Qo7OO
I0g36NrkuGVDrpld3gm1w9ruaXQtc0/Q6D9ki+Ej8e1iymw4GS7Sul4TJZG8XnyC
pt2Pp7700SDiWunU/WlY2l48WG2mgxxnSKjHC2rvnJWJh91YYirx9xr7QhPW7l5T
G54Q1fHlOXEIW/gPEyg+mQKBgFMv1u13btgS3vVb1AtFVVgYwcF5oUneF1tgCM4n
II3R3I78eNkI11dau9S5t/w16iopaN0+nCc2lwcF3A4la3tuIDCipwf3Ug3ZznyL
rFVWo8xBtxhh/KTQ2wtTmtIXIxeCkbiY9Qu1GHnVkMRktHAdCK5Uxs3bI4f5/lb+
7L8RAoGBAJEuaeI4ixT11Sg/NLq3gyEzxIYfd5pBGGlquMnBxdXZwdegCMNbYD47
RQZnahQSh6H23+jD0W33IlHFlyN6ISdy4UBdvkPee3DU2QaczpHo05Gy7q5BQyIl
smWlpUZ7x+lQffpDY6INOyqOGpQHiCgiRqeTHsYEGl4ZCzAjAz2M
-----END RSA PRIVATE KEY-----

)KEY";