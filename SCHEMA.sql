--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: get_event_image_list(integer, text); Type: FUNCTION; Schema: public; Owner: vlgvqfigayasyj
--

CREATE FUNCTION get_event_image_list(integer, text) RETURNS text
    LANGUAGE sql
    AS $_$
SELECT string_agg(concat_ws('^', images.name, images.title), '|' ORDER BY images.sorting) AS event_image_list
FROM event_images
RIGHT JOIN images ON images.id = event_images.image_id
INNER JOIN image_types ON images.type_id = image_types.id
WHERE event_images.event_id = $1
AND image_types.name = $2
AND images.active IS TRUE
AND images.content IS NOT NULL
GROUP BY event_images.event_id;
$_$;


ALTER FUNCTION public.get_event_image_list(integer, text) OWNER TO vlgvqfigayasyj;

--
-- Name: get_project_image_list(integer, text); Type: FUNCTION; Schema: public; Owner: vlgvqfigayasyj
--

CREATE FUNCTION get_project_image_list(integer, text) RETURNS text
    LANGUAGE sql
    AS $_$
SELECT string_agg(concat_ws('^', images.name, images.title), '|' ORDER BY images.sorting) AS project_image_list
FROM project_images
RIGHT JOIN images ON images.id = project_images.image_id
INNER JOIN image_types ON images.type_id = image_types.id
WHERE project_images.project_id = $1
AND image_types.name = $2
AND images.active IS TRUE
AND images.content IS NOT NULL
GROUP BY project_images.project_id;
$_$;


ALTER FUNCTION public.get_project_image_list(integer, text) OWNER TO vlgvqfigayasyj;

--
-- Name: get_project_media_list(integer); Type: FUNCTION; Schema: public; Owner: vlgvqfigayasyj
--

CREATE FUNCTION get_project_media_list(integer) RETURNS text
    LANGUAGE sql
    AS $_$
SELECT string_agg(concat_ws('^', medias.content, medias.title, media_types.name, media_types.title), '|' ORDER BY medias.sorting) AS project_media_list
FROM project_medias
RIGHT JOIN medias ON medias.id = project_medias.media_id
INNER JOIN media_types ON media_types.id = medias.type_id
WHERE project_medias.project_id = $1
AND medias.active IS TRUE
AND medias.content IS NOT NULL
GROUP BY project_medias.project_id;
$_$;


ALTER FUNCTION public.get_project_media_list(integer) OWNER TO vlgvqfigayasyj;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: banner_images; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE banner_images (
    image_id integer NOT NULL,
    sorting integer DEFAULT 1 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    published boolean DEFAULT false NOT NULL
);


ALTER TABLE public.banner_images OWNER TO vlgvqfigayasyj;

--
-- Name: event_images; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE event_images (
    image_id integer NOT NULL,
    event_id integer NOT NULL
);


ALTER TABLE public.event_images OWNER TO vlgvqfigayasyj;

--
-- Name: events; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE events (
    date date,
    title text,
    title_short text,
    description_html text,
    description_short text,
    active boolean DEFAULT true NOT NULL,
    sorting integer DEFAULT 1,
    name text NOT NULL,
    doc_keywords text,
    doc_description text,
    doc_title text,
    id integer NOT NULL,
    keywords text,
    published boolean DEFAULT false NOT NULL
);


ALTER TABLE public.events OWNER TO vlgvqfigayasyj;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: vlgvqfigayasyj
--

CREATE SEQUENCE events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO vlgvqfigayasyj;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlgvqfigayasyj
--

ALTER SEQUENCE events_id_seq OWNED BY events.id;


--
-- Name: featured_projects; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE featured_projects (
    project_id integer NOT NULL,
    sorting integer DEFAULT 1 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    published boolean DEFAULT false NOT NULL
);


ALTER TABLE public.featured_projects OWNER TO vlgvqfigayasyj;

--
-- Name: image_types; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE image_types (
    title text,
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.image_types OWNER TO vlgvqfigayasyj;

--
-- Name: image_types_id_seq; Type: SEQUENCE; Schema: public; Owner: vlgvqfigayasyj
--

CREATE SEQUENCE image_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.image_types_id_seq OWNER TO vlgvqfigayasyj;

--
-- Name: image_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlgvqfigayasyj
--

ALTER SEQUENCE image_types_id_seq OWNED BY image_types.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE images (
    id integer NOT NULL,
    title text,
    content bytea,
    name text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    description text,
    sorting integer DEFAULT 1 NOT NULL,
    force_deploy boolean DEFAULT false NOT NULL,
    type_id integer DEFAULT 1 NOT NULL,
    published boolean DEFAULT false NOT NULL
);


ALTER TABLE public.images OWNER TO vlgvqfigayasyj;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: vlgvqfigayasyj
--

CREATE SEQUENCE images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.images_id_seq OWNER TO vlgvqfigayasyj;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlgvqfigayasyj
--

ALTER SEQUENCE images_id_seq OWNED BY images.id;


--
-- Name: media_types; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE media_types (
    id integer NOT NULL,
    title text,
    name text NOT NULL
);


ALTER TABLE public.media_types OWNER TO vlgvqfigayasyj;

--
-- Name: media_types_id_seq; Type: SEQUENCE; Schema: public; Owner: vlgvqfigayasyj
--

CREATE SEQUENCE media_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.media_types_id_seq OWNER TO vlgvqfigayasyj;

--
-- Name: media_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlgvqfigayasyj
--

ALTER SEQUENCE media_types_id_seq OWNED BY media_types.id;


--
-- Name: medias; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE medias (
    id integer NOT NULL,
    name text NOT NULL,
    title text,
    content text,
    sorting integer DEFAULT 1 NOT NULL,
    type_id integer DEFAULT 1 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    published boolean DEFAULT false NOT NULL
);


ALTER TABLE public.medias OWNER TO vlgvqfigayasyj;

--
-- Name: medias_id_seq; Type: SEQUENCE; Schema: public; Owner: vlgvqfigayasyj
--

CREATE SEQUENCE medias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.medias_id_seq OWNER TO vlgvqfigayasyj;

--
-- Name: medias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlgvqfigayasyj
--

ALTER SEQUENCE medias_id_seq OWNED BY medias.id;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE pages (
    id integer NOT NULL,
    name text DEFAULT 'undefined'::text NOT NULL,
    title text,
    description_short text,
    sorting integer DEFAULT 1 NOT NULL,
    title_short text,
    active boolean DEFAULT true NOT NULL,
    description_html text,
    doc_title text,
    doc_keywords text,
    doc_description text,
    menu boolean DEFAULT true NOT NULL,
    keywords text,
    footer boolean DEFAULT false NOT NULL,
    published boolean DEFAULT false NOT NULL
);


ALTER TABLE public.pages OWNER TO vlgvqfigayasyj;

--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: vlgvqfigayasyj
--

CREATE SEQUENCE pages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pages_id_seq OWNER TO vlgvqfigayasyj;

--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlgvqfigayasyj
--

ALTER SEQUENCE pages_id_seq OWNED BY pages.id;


--
-- Name: project_categories; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE project_categories (
    title text,
    sorting integer DEFAULT 1 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    name text DEFAULT ' '::text NOT NULL,
    description_html text,
    doc_description text,
    doc_keywords text,
    doc_title text,
    description_short text,
    keywords text,
    title_short text,
    id integer NOT NULL,
    published boolean DEFAULT false NOT NULL
);


ALTER TABLE public.project_categories OWNER TO vlgvqfigayasyj;

--
-- Name: project_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: vlgvqfigayasyj
--

CREATE SEQUENCE project_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_categories_id_seq OWNER TO vlgvqfigayasyj;

--
-- Name: project_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlgvqfigayasyj
--

ALTER SEQUENCE project_categories_id_seq OWNED BY project_categories.id;


--
-- Name: project_images; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE project_images (
    project_id integer NOT NULL,
    image_id integer NOT NULL
);


ALTER TABLE public.project_images OWNER TO vlgvqfigayasyj;

--
-- Name: project_medias; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE project_medias (
    project_id integer NOT NULL,
    media_id integer NOT NULL
);


ALTER TABLE public.project_medias OWNER TO vlgvqfigayasyj;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE projects (
    id integer NOT NULL,
    title text,
    description_html text,
    description_short text,
    title_short text,
    active boolean DEFAULT true NOT NULL,
    name text NOT NULL,
    date date,
    category_id integer,
    sorting integer DEFAULT 1 NOT NULL,
    doc_keywords text,
    doc_description text,
    doc_title text,
    keywords text,
    published boolean DEFAULT false NOT NULL
);


ALTER TABLE public.projects OWNER TO vlgvqfigayasyj;

--
-- Name: projets_id_seq; Type: SEQUENCE; Schema: public; Owner: vlgvqfigayasyj
--

CREATE SEQUENCE projets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.projets_id_seq OWNER TO vlgvqfigayasyj;

--
-- Name: projets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlgvqfigayasyj
--

ALTER SEQUENCE projets_id_seq OWNED BY projects.id;


--
-- Name: websites; Type: TABLE; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE TABLE websites (
    title text,
    subtitle text,
    active boolean DEFAULT true NOT NULL,
    name text NOT NULL,
    copyright text,
    sorting integer DEFAULT 1 NOT NULL,
    version text,
    doc_author text,
    doc_keywords text,
    author text,
    "doc_titleFormat" text,
    doc_language text DEFAULT 'fr'::text NOT NULL,
    id integer NOT NULL,
    published boolean DEFAULT false NOT NULL
);


ALTER TABLE public.websites OWNER TO vlgvqfigayasyj;

--
-- Name: COLUMN websites.doc_author; Type: COMMENT; Schema: public; Owner: vlgvqfigayasyj
--

COMMENT ON COLUMN websites.doc_author IS 'Document author.';


--
-- Name: COLUMN websites.doc_keywords; Type: COMMENT; Schema: public; Owner: vlgvqfigayasyj
--

COMMENT ON COLUMN websites.doc_keywords IS 'Appended document keywords.';


--
-- Name: COLUMN websites."doc_titleFormat"; Type: COMMENT; Schema: public; Owner: vlgvqfigayasyj
--

COMMENT ON COLUMN websites."doc_titleFormat" IS 'Use the placeholder "{pageTitle}" for the page title value.';


--
-- Name: websites_id_seq; Type: SEQUENCE; Schema: public; Owner: vlgvqfigayasyj
--

CREATE SEQUENCE websites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.websites_id_seq OWNER TO vlgvqfigayasyj;

--
-- Name: websites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vlgvqfigayasyj
--

ALTER SEQUENCE websites_id_seq OWNED BY websites.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: vlgvqfigayasyj
--

ALTER TABLE ONLY events ALTER COLUMN id SET DEFAULT nextval('events_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: vlgvqfigayasyj
--

ALTER TABLE ONLY image_types ALTER COLUMN id SET DEFAULT nextval('image_types_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: vlgvqfigayasyj
--

ALTER TABLE ONLY images ALTER COLUMN id SET DEFAULT nextval('images_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: vlgvqfigayasyj
--

ALTER TABLE ONLY media_types ALTER COLUMN id SET DEFAULT nextval('media_types_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: vlgvqfigayasyj
--

ALTER TABLE ONLY medias ALTER COLUMN id SET DEFAULT nextval('medias_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: vlgvqfigayasyj
--

ALTER TABLE ONLY pages ALTER COLUMN id SET DEFAULT nextval('pages_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: vlgvqfigayasyj
--

ALTER TABLE ONLY project_categories ALTER COLUMN id SET DEFAULT nextval('project_categories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: vlgvqfigayasyj
--

ALTER TABLE ONLY projects ALTER COLUMN id SET DEFAULT nextval('projets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: vlgvqfigayasyj
--

ALTER TABLE ONLY websites ALTER COLUMN id SET DEFAULT nextval('websites_id_seq'::regclass);


--
-- Name: events_id_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY events
    ADD CONSTRAINT events_id_key UNIQUE (id);


--
-- Name: events_name_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY events
    ADD CONSTRAINT events_name_key UNIQUE (name);


--
-- Name: events_pkey; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: featured_projects_project_id_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY featured_projects
    ADD CONSTRAINT featured_projects_project_id_key UNIQUE (project_id);


--
-- Name: image_types_id_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY image_types
    ADD CONSTRAINT image_types_id_key UNIQUE (id);


--
-- Name: image_types_name_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY image_types
    ADD CONSTRAINT image_types_name_key UNIQUE (name);


--
-- Name: image_types_pkey; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY image_types
    ADD CONSTRAINT image_types_pkey PRIMARY KEY (id);


--
-- Name: images_name_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_name_key UNIQUE (name);


--
-- Name: images_pkey; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: media_types_name_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY media_types
    ADD CONSTRAINT media_types_name_key UNIQUE (name);


--
-- Name: media_types_pkey; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY media_types
    ADD CONSTRAINT media_types_pkey PRIMARY KEY (id);


--
-- Name: medias_id_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY medias
    ADD CONSTRAINT medias_id_key UNIQUE (id);


--
-- Name: medias_name_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY medias
    ADD CONSTRAINT medias_name_key UNIQUE (name);


--
-- Name: medias_pkey; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY medias
    ADD CONSTRAINT medias_pkey PRIMARY KEY (id);


--
-- Name: pages_name_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY pages
    ADD CONSTRAINT pages_name_key UNIQUE (name);


--
-- Name: pages_pkey; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: project_categories_id_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY project_categories
    ADD CONSTRAINT project_categories_id_key UNIQUE (id);


--
-- Name: project_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY project_categories
    ADD CONSTRAINT project_categories_name_key UNIQUE (name);


--
-- Name: project_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY project_categories
    ADD CONSTRAINT project_categories_pkey PRIMARY KEY (id);


--
-- Name: projects_name_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_name_key UNIQUE (name);


--
-- Name: projets_pkey; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projets_pkey PRIMARY KEY (id);


--
-- Name: unique_id; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY events
    ADD CONSTRAINT unique_id UNIQUE (id);


--
-- Name: unique_image_id; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY banner_images
    ADD CONSTRAINT unique_image_id UNIQUE (image_id);


--
-- Name: unique_name; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY events
    ADD CONSTRAINT unique_name UNIQUE (name);


--
-- Name: websites_id_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY websites
    ADD CONSTRAINT websites_id_key UNIQUE (id);


--
-- Name: websites_name_key; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY websites
    ADD CONSTRAINT websites_name_key UNIQUE (name);


--
-- Name: websites_pkey; Type: CONSTRAINT; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

ALTER TABLE ONLY websites
    ADD CONSTRAINT websites_pkey PRIMARY KEY (id);


--
-- Name: event_images_event_id_idx; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX event_images_event_id_idx ON event_images USING btree (event_id);


--
-- Name: event_images_image_id_idx; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX event_images_image_id_idx ON event_images USING btree (image_id);


--
-- Name: featured_projects_project_id_idx; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX featured_projects_project_id_idx ON featured_projects USING btree (project_id);


--
-- Name: index_id; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX index_id ON events USING btree (id);


--
-- Name: index_id1; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX index_id1 ON medias USING btree (id);


--
-- Name: index_id2; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX index_id2 ON image_types USING btree (id);


--
-- Name: index_image_id; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX index_image_id ON banner_images USING btree (image_id);


--
-- Name: index_name; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX index_name ON media_types USING btree (name);


--
-- Name: index_name1; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX index_name1 ON medias USING btree (name);


--
-- Name: index_name2; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX index_name2 ON image_types USING btree (name);


--
-- Name: media_types_id_idx; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX media_types_id_idx ON media_types USING btree (id);


--
-- Name: project_categories_id_idx; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX project_categories_id_idx ON project_categories USING btree (id);


--
-- Name: project_images_image_id_idx; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX project_images_image_id_idx ON project_images USING btree (image_id);


--
-- Name: project_images_project_id_idx; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX project_images_project_id_idx ON project_images USING btree (project_id);


--
-- Name: project_medias_media_id_idx; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX project_medias_media_id_idx ON project_medias USING btree (media_id);


--
-- Name: project_medias_project_id_idx; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX project_medias_project_id_idx ON project_medias USING btree (project_id);


--
-- Name: websites_id_idx; Type: INDEX; Schema: public; Owner: vlgvqfigayasyj; Tablespace: 
--

CREATE INDEX websites_id_idx ON websites USING btree (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: vlgvqfigayasyj
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM vlgvqfigayasyj;
GRANT ALL ON SCHEMA public TO vlgvqfigayasyj;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

