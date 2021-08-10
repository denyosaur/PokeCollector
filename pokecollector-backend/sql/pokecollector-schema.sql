CREATE TABLE users (
    id PRIMARY KEY TEXT,
    username TEXT UNIQUE NOT NULL CHECK (username = lower(handle)),
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT CHECK (position('@' IN email) > 1),
    currency_amount INTEGER NOT NULL
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE trades (
    id PRIMARY KEY TEXT,
    seller_id TEXT UNIQUE NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    buyer_id TEXT UNIQUE NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    seller_offer TEXT NOT NULL,
    buyer_offer TEXT NOT NULL,
    seller_message TEXT NOT NULL,
    buyer_message TEXT NOT NULL,
);

CREATE TABLE cards (
    id PRIMARY KEY TEXT,
    name TEXT UNIQUE NOT NULL CHECK (username = lower(handle)),
    supertype TEXT NOT NULL,
    subtypes TEXT[],
    hp TEXT,
    types TEXT[],
    evolvesTo TEXT[],
    rules TEXT[],
    attacks TEXT,
    weaknesses TEXT,
    retreatCost TEXT,
    convertedRetreatCost TEXT,
    setName TEXT,
    setLogo TEXT,
    number TEXT,
    artist TEXT,
    rarity TEXT,
    nationalPokedexNumbers TEXT[],
    legalities TEXT,
    images TEXT,
    tcgplayer TEXT,
    prices TEXT
);

CREATE TABLE users_cards (
    id PRIMARY KEY TEXT,
    user_id TEXT UNIQUE NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    card_id TEXT UNIQUE NOT NULL
        REFERENCES cards(id) ON DELETE CASCADE,
);

CREATE TABLE users_decks (
    id PRIMARY KEY TEXT,
    user_id TEXT UNIQUE NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    users_cards_id TEXT UNIQUE NOT NULL
        REFERENCES users_cards(id),
);
