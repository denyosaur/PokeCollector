CREATE TABLE users (
    id PRIMARY KEY TEXT,
    username TEXT UNIQUE NOT NULL CHECK (username = lower(handle)),
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE CHECK (position('@' IN email) > 1),
    currency_amount INTEGER NOT NULL
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE trades (
    id PRIMARY KEY TEXT,
    seller_name TEXT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    buyer_name TEXT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    seller_offer TEXT[] NOT NULL,
    buyer_offer TEXT[] NOT NULL,
    completed BOOLEAN NOT NULL
);

CREATE TABLE messages (
    id PRIMARY KEY TEXT,
    trade_id
        REFERENCES trades(id) ON DELETE CASCADE,
    username TEXT NOT NULL
        REFERENCES users(username) ON DELETE CASCADE,
    message TEXT,
    timestamp NOT NULL
)

CREATE TABLE cards (
    id PRIMARY KEY TEXT,
    name TEXT UNIQUE NOT NULL CHECK (username = lower(handle)),
    supertype TEXT NOT NULL,
    subtypes TEXT[],
    hp TEXT,
    types TEXT[],
    evolves_to TEXT[],
    rules TEXT[],
    attacks TEXT,
    weaknesses TEXT,
    retreat_cost TEXT,
    converted_retreat_cost TEXT,
    set_name TEXT,
    set_logo TEXT,
    number TEXT,
    artist TEXT,
    rarity TEXT,
    national_pokedex_numbers TEXT[],
    legalities TEXT,
    images TEXT,
    tcgplayer TEXT,
    prices TEXT
);

CREATE TABLE users_cards (
    id PRIMARY KEY TEXT,
    username TEXT 
        REFERENCES users(username) ON DELETE CASCADE,
    card_id TEXT NOT NULL
        REFERENCES cards(id) ON DELETE CASCADE,
);

CREATE TABLE users_decks (
    id PRIMARY KEY TEXT,
    username TEXT NOT NULL
        REFERENCES users(username) ON DELETE CASCADE,
    deck_name TEXT NOT NULL
);

CREATE TABLE cards_in_users_decks (
    id PRIMARY KEY TEXT,
    deck_id TEXT NOT NULL
        REFERENCES users_decks(id) ON DELETE CASCADE,
    users_cards_id TEXT NOT NULL
        REFERENCES users_cards(id) ON DELETE CASCADE,
);
