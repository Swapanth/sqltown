import type { Dialect, SQLDialect } from '../models/types';

export const mockDialects: Dialect[] = [
    {
        dialect_id: 1,
        dialect_name: 'mysql',
        display_name: 'MySQL',
        logo_url: '/logos/mysql.svg',
        description: 'The world\'s most popular open source database',
        documentation_url: 'https://dev.mysql.com/doc/',
        is_active: true,
    },
    {
        dialect_id: 2,
        dialect_name: 'postgresql',
        display_name: 'PostgreSQL',
        logo_url: '/logos/postgresql.svg',
        description: 'The world\'s most advanced open source database',
        documentation_url: 'https://www.postgresql.org/docs/',
        is_active: true,
    },
    {
        dialect_id: 3,
        dialect_name: 'sqlite',
        display_name: 'SQLite',
        logo_url: '/logos/sqlite.svg',
        description: 'A lightweight, serverless database engine',
        documentation_url: 'https://www.sqlite.org/docs.html',
        is_active: true,
    },
    {
        dialect_id: 4,
        dialect_name: 'oracle',
        display_name: 'Oracle Database',
        logo_url: '/logos/oracle.svg',
        description: 'Enterprise-grade relational database',
        documentation_url: 'https://docs.oracle.com/en/database/',
        is_active: true,
    },
    {
        dialect_id: 5,
        dialect_name: 'mssql',
        display_name: 'Microsoft SQL Server',
        logo_url: '/logos/mssql.svg',
        description: 'Microsoft\'s relational database management system',
        documentation_url: 'https://docs.microsoft.com/en-us/sql/',
        is_active: true,
    },
    {
        dialect_id: 6,
        dialect_name: 'mariadb',
        display_name: 'MariaDB',
        logo_url: '/logos/mariadb.svg',
        description: 'MySQL-compatible database server',
        documentation_url: 'https://mariadb.com/kb/en/',
        is_active: true,
    },
];

export const getDialectById = (dialectId: number): Dialect | undefined => {
    return mockDialects.find(d => d.dialect_id === dialectId);
};

export const getDialectByName = (dialectName: SQLDialect): Dialect | undefined => {
    return mockDialects.find(d => d.dialect_name === dialectName);
};
