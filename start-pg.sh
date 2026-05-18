#!/bin/bash
exec /usr/bin/su - postgres -c "/usr/lib/postgresql/15/bin/postgres -D /var/lib/postgresql/15/main -c config_file=/var/lib/postgresql/15/main/postgresql.conf"