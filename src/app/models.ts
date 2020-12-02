import { SourceMap } from '@angular/compiler';

export interface ApiKey {
    id: string;
    apikey: string;
}

export interface Country {
    alpha2Code: string;
    name: string;
    flag: string
}

export interface Article {
    code: string,
    author: string,
    content: string,
    description: string,
    publishedAt: string,
    source: Source,
    title: string,
    url: string,
    urlToImage: string,
    saved: number,
    timestamp: number
}

export interface Source {
    id: string,
    name: string
}