# Enlaces con origen (UTM)

Pega cada enlace donde corresponde. TODO mensaje de WhatsApp que sale de la web
termina con `(ref: web)` (también el tráfico directo, sin UTM). Si el visitante
llegó por uno de estos enlaces, se añade aparte `(fuente: <origen>)`, por
ejemplo `(fuente: instagram/bio)`. Solo se recuerda durante la visita (sin
cookies ni analítica).

`(ref: web)` indica "consulta iniciada desde la web"; no prueba la identidad de
nadie (cualquiera puede escribirlo) y las etiquetas de exclusión del CRM
siempre prevalecen.

| Dónde se pega | Enlace |
|---|---|
| Instagram (biografía) | https://lacasaderoos.com/?utm_source=instagram&utm_campaign=bio |
| TikTok (biografía) | https://lacasaderoos.com/?utm_source=tiktok&utm_campaign=bio |
| Facebook (página, botón/sitio web) | https://lacasaderoos.com/?utm_source=facebook&utm_campaign=pagina |
| Google Business Profile (sitio web) | https://lacasaderoos.com/?utm_source=google&utm_campaign=perfil |
| Google Business Profile (botón de reservas, opcional) | https://lacasaderoos.com/reservar?utm_source=google&utm_campaign=reservar |
| Publicaciones/anuncios (cambia `nombre`) | https://lacasaderoos.com/?utm_source=instagram&utm_campaign=nombre |

Reglas: solo letras minúsculas, números, guion y guion bajo; máximo 30
caracteres por valor. Se usan `utm_source` y `utm_campaign`.

Airbnb no permite enlaces externos en los anuncios, así que no lleva UTM.
