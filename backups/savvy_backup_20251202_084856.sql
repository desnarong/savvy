--
-- PostgreSQL database dump
--

\restrict fLrgLcNCQYdRy02UXysyRlAeBkUBVl7FAa8zz0DqJcUKZEvCQ25SXDpjVUgznOh

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Plan; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Plan" AS ENUM (
    'FREE',
    'PRO'
);


ALTER TYPE public."Plan" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Budget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Budget" (
    id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    "categoryId" text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Budget" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    icon text,
    type text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "userId" text NOT NULL,
    amount double precision NOT NULL,
    ref1 text NOT NULL,
    "transId" text,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "qrCode" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    ref2 text
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: PricingPlan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PricingPlan" (
    id text NOT NULL,
    name text NOT NULL,
    price integer NOT NULL,
    days integer NOT NULL,
    "isRecommended" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PricingPlan" OWNER TO postgres;

--
-- Name: SystemConfig; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemConfig" (
    key text NOT NULL,
    value text NOT NULL
);


ALTER TABLE public."SystemConfig" OWNER TO postgres;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    note text,
    "categoryId" text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "resetToken" text,
    "resetTokenExpiry" timestamp(3) without time zone,
    plan public."Plan" DEFAULT 'FREE'::public."Plan" NOT NULL,
    "subscriptionId" text,
    "subscriptionEnds" timestamp(3) without time zone,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Data for Name: Budget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Budget" (id, amount, month, year, "categoryId", "userId") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, icon, type, "userId") FROM stdin;
cmio8ufi3000214jqnl6is0gj	1	food	EXPENSE	cmio8dwpx0000f42cq8dbw5bs
cmio8uk7g000414jqhzv8zvrx	2	transport	EXPENSE	cmio8dwpx0000f42cq8dbw5bs
cmio8uo1b000614jqwwcf8ais	3	home	EXPENSE	cmio8dwpx0000f42cq8dbw5bs
cmio8uu4p000814jqelx0u1ng	4	shopping	EXPENSE	cmio8dwpx0000f42cq8dbw5bs
cmio8uxlh000a14jq0dge9r6l	5	coffee	EXPENSE	cmio8dwpx0000f42cq8dbw5bs
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "userId", amount, ref1, "transId", status, "qrCode", "createdAt", "updatedAt", ref2) FROM stdin;
cmio8v74w000c14jqcrzehy3p	cmio8dwpx0000f42cq8dbw5bs	10	ORD-cmio8-1764659772651	PPAY_692e923cc8699	PENDING	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUgAAAFIAQMAAAAI2vVwAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABrklEQVRoge3VwXKDMAwEUP3/T29n0K4kOgVEeslhnQwB+5mDvFUjPDy+eiAH7ziVX1562nIheeVS/hL3quVeHiuR35yLdECvWr6W4ErzsPyX1I+2XVfe8lqWh2aFL3qI5Z0s8eeHq5ZbqaEcZ3Rz9SwstzIXFONyUKYt38mufMqovmD5XkKFx3ABncHoC5YbyXprE5dR9Y+ztbyVNXOUuu50HOOFlkuJQp3i0NZT5S03ku2gL8xzKNZhuZYs9aknqNJQpi1fyKy3/mVxQ5Y/zsryWeYzU8yF5tkVYLmWmtdNZKx73yi+5UZmjKvbdsmZ6AjLvWS1oQ2ss06gjsVyJ6mDIa4WEfpinpLlo2RkNcHqQ/1hvNFyI2NEORRbod5guZMHyctwArMtWG4lJ6BYx/yEwmy5kRVY3moXOs6WL2U9EOa+PgHLvczsopLcHQHoJ8ut7PKz2lEwpCz3UvXNBahN1BTmuyyfZZU6RqyBnlILsdxJTnNOte6OgfE2y62kqRifDsTyE6nQ6hB4Ar+TbHkvea1IZ55L9R7LjeTff8UXBfI4Yu6zfJIeHl87fgB3S6t8qEJGNwAAAABJRU5ErkJggg==	2025-12-02 07:16:12.896	2025-12-02 07:16:12.896	\N
cmio919vo0001s16ganrat0zu	cmio8dwpx0000f42cq8dbw5bs	10.01	ORD-cmio8-1764660056107	PPAY_692e935847bb0	PENDING	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoAQMAAABAK/OWAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACAklEQVR4nO3VQXbCMAwEUN3/0uojmhkrtGURacUbA65xvrPoRCLCw+OrR9aI1/s1XZ/gxvWGsF7RnPMEEFLngvWW1iajqZiUh4T1ok6hTEYTKhLrbY1FpRFcfcrS+pnW3PMIlsU/vcr6qcZv54cXhPWG7uN3y0FKfw7rZzpP/wHVYX5VTVjPdTuEiKK3IVwL6yV92k+2gLhVRw63nup62NV5rvPnDLJpWVpPNFQ2xRsItrKw3tDJU6Ct+yOotN7RkXrwFQEpGlOrG+sNrXyuNJgTd1Ua1hs6iBiLCoK36NVgPdetIlpN1DKZn/WOvmXRDuNkreM0JuupzvbEcxVY1p36rayHOvXfRyR1iaVw7Ypbz/XZQTiMjLdorcp6rANXUAYsCE0hZ72i+dArHu6krvCI9VjzK/VpRvjgVyCtV3TG+ZNsOiyLfsF6R6eaT5RhKbRLybtar2gkgCq4igPncU4hWg91qMngsKIBl7Ne0YUZAp/++lIr5mS9oPH4pyYe5dzLxHqsg90H9YAOz/N52pP1hk7Ugc4ysJNZJlO0Huvzf7+tGAvK4g1bP9bay1YPaPHnpSytpxrzFQcMS+Ckw/5jPdeVxi0SfWd22e5qvaGrCoIrcAb2no71VNfjfw+rDiUjs17RmDP69Qomo1PrDY3+EthEKqqQmpSO9VB7eHzt+AF3tceY6rHeWgAAAABJRU5ErkJggg==	2025-12-02 07:20:56.387	2025-12-02 07:20:56.387	\N
cmio99f210003s16gbqoymfeq	cmio8dwpx0000f42cq8dbw5bs	10.02	ORD-cmio8-1764660436171	PPAY_692e94d44236f	PENDING	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUgAAAFIAQMAAAAI2vVwAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABpklEQVRoge3UwXICMQwDUP//T6tTLCkJdMCZXjgowC6bvHBwhKsyMr56oEf1q34/umGtRo6lro/n3tQXbXq5Rr6VXfdarljqPo21Gnkhz2Ij8p+SjyWvychbqetjVn2X63/2kMh3Umt/v7gaOZUej4m17Xk5ciqdW73BDDvMiBzLcwYMb89h/UTkldw6Ab9tJ4PIuewK8wtnvfT0GPlZYn8f83CsK3IsPdW0V85eEXkl935AsPqFt0XOJRdKycW2Hav4kUOp+JZiDD3oNCKn0s0AnFvlXzjyQlpzVTF2ukkjJ7Kg/KrWcJSPvhA5kp63Un7hroHIsSyw8AzvFurjgCJncqsv795ba0fkVHZD4CxKLcI/U4x55FB2fpVl9QOv4XiK/ChLuXX14TsjXpFjidL/v86pdRSRF9K1befmwPNYK5EjqZr7zuQyxFidIXIiNfYDgJtE1QuMfCtV3V5mxZlk6DAi55JX76vtR87KR46kaixQ61npjryW/UVVV/21KfJWsj3Ywz3BKY8cSV611qu6CUROpf7/SnBrRblWlCMnMiPja8cPUk37LOczTtYAAAAASUVORK5CYII=	2025-12-02 07:27:16.345	2025-12-02 07:27:16.345	\N
cmio9c3rq0001pre02w45hqaa	cmio8dwpx0000f42cq8dbw5bs	10.03	ORD-cmio8-1764660561417	PPAY_692e95518dfd8	PENDING	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoAQMAAABAK/OWAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB/ElEQVR4nO3VQXYbMQwDUNz/0mgzBEjZcTYRV3lQ06ktfWlRDBQgI+NPD9b4/+/z+Wvmma3Frx+L6BX9Mq1PzzedhTcXfak1UxGxkqk1PCt82RO9ozXxVgyvRW9r+BZyN1SJ6G3dT+oOkhH/7qJvdKfy4x+J6A19jpp0QKSvpM8j+neaff/oy2z21+5E9K1m/yKV662qCM4zom91XenEvPu1RFeCFtEb2mjmgb6D6ow5OPpe01lAt0xt/vApekP70oFDqjMcD6YU0Qsansfh1IIzOESvafq1rxjoC4dnIaJ3dL30YxQIJ7OzDdH3uhoxzgfM/ug1zQqIjklPTEB1UPSWVghO5ONDOPpek94zW/nSBQyPvteD4Vlp2LsM0dcaumjYCakafgD9N3pB9wS1UYlVMXxYnxx9p33ZWLsdHQo1ole0144l7VE2k2D0hvbdo/WugHPBZBe9on3j0ClMPTobRi9p7fAyO5rODm8j+lZ7Q29yNO4G3vZE/1br9fckiNlWLThqEn2twaZVAroCVYneGb2iheBV+MsbZvSKnpBk64SOx+cgekXT//+ugdvgKccVvaP19Jtf9eCRkKoRvaR77fjYgn1E9KrGlGDaABXhWzrRt5p91dBR1ccJLHpF60mc688PiJNGb2jdL9CkUlFDeJYjekFnZPzZ8Q9YuNaXPGd62gAAAABJRU5ErkJggg==	2025-12-02 07:29:21.685	2025-12-02 07:29:21.685	\N
cmio9d3nn0003pre0s3sod5en	cmio8dwpx0000f42cq8dbw5bs	10.04	ORD-cmio8-1764660608009	PPAY_692e958019553	PENDING	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoAQMAAABAK/OWAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB9klEQVR4nO3UwW7kMAwDUP3/T7PYmKQ00/Yy1l4KZoA0sZ98KCNV5cr1py+c69/f5/X5FbzXInpF+45efkzxjHcXfae5oiD4xHhOXKMmekfDnPsKLPq/aJGu1CiK3tW+gzU05N9d9I0GZio//SiiN/S8zqICAh9+u6I/0+j5Q+pivbonom/1bAbOIJZyteYZ0Ru6xra2oJY4WxW9o/vT13qVZ9BzwE8DK/pzjc7ltEM5rten6AUNTZs5eziRDAFE72i+kcOZQMYwekt3IuyKs3qaRA0RvaMZzXhhxYnFJ0VvaXUEZlQPBJRU9JLGyQRKqQvPAHJW0UsaDgSlDe6dAngh+l6rCxQUI4LqlVv0in44V7rkJTG4GaLvdTVVGeat3g6PvtI0p0pxOKLiWp8cfaur0DlAQWlL4wnRW3oMH46dAXhDRS9quMQtwFLvRa/o4vhhQ5AKOBtEb2kwCr3x7ne66CVdzIEff+m9Rm+Mboi+0kzDH3tX8YgabRJ9rQtNHQNLatRW9Irm7Kkzd3jrJWNEr+gREr/+gjoEbBO8jfzozzX0//edmamUkwfRO5p3ff8wmz0CpRN9rQUwIlBkesA4NXpDqxGcBtNxa0SvanjUqB/4iD4vekOrAeplv1zd2UQv6B405U8f3SHn5nSiL3WuXH/2+gIS/6bHxBTYbwAAAABJRU5ErkJggg==	2025-12-02 07:30:08.195	2025-12-02 07:30:08.195	\N
cmio9feo60001je79uc97ywrq	cmio8dwpx0000f42cq8dbw5bs	10.05	ORD-cmio8-1764660715338	PPAY_692e95eb9539f	PENDING	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoAQMAAABAK/OWAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB+UlEQVR4nO3WwW4DQQgDUP7/p90m2EAitYfAKfJU3WZnHnuoF5QIL6+vXsgVdfm9xvPyOAxtAtY3uq7c6gPk5d1Z7zSYxUMBjETBpQesj/XsA9X1pvW1HgV5F+oF61td12oFVsQotL7SueKfHwrrCz1Xbiog8MNfy/ozjZ4/pFWs2+oJ663ONz7qYA7/wEDWJ1o56FgBQS2BeqL1gUafQjFU8fMBcwRZbzVzwFD5kO6TahTrvYamzRj5wS84VfLy3cd6o0c75G+0hMbQaAbrvcZ88fmRDxn71idasfDdByoiTaTZDdZ7zY5QSbcIK6wPNTIgRKfSu4yMHWJ9op9AWwjd1yeoxPpCY8JgTGqNdM2ttzo0YvLSVZhe2HqtlUYSVfSlhPWFZjDQvt5+zh6KysZ6qaNyQQtUB7AvWGi91myAecSaykbV1ge6blVVrcBcdGZ9pbsDmAIKVDajdaw3WonM4xEHBGF9ovv/zhqmlUy9YX2l+frPfuAPslNmm1ivdYAJBId716dFAesDDR5UKWPKu8awPtHj/84pw7mTT0mJN2z9sUY1gZbCqQEUI0vrre5sdAv9eT6DTwzrI61AMGR1wGtg1mc6lERw/uAlprd0rLcaNWrQBRi/1kc6qgnmeVR1Z2N9oDlfgptMpYYPiZ5qvdReXl+7fgD0eWcHPnwmqQAAAABJRU5ErkJggg==	2025-12-02 07:31:55.782	2025-12-02 07:31:55.782	\N
cmioabuxe00018e0fu876l8sj	cmio8dwpx0000f42cq8dbw5bs	10	ORD-1764662229841-133	\N	PENDING	\N	2025-12-02 07:57:09.842	2025-12-02 07:57:09.842	cmio8tcne000014jqx4lpmg0x
cmioafv73000185qbjay1a9be	cmio8dwpx0000f42cq8dbw5bs	10	ORD-1764662416814-53	\N	PENDING	\N	2025-12-02 08:00:16.815	2025-12-02 08:00:16.815	cmio8tcne000014jqx4lpmg0x
cmioaj5vd0001pjpnsasi1261	cmio8dwpx0000f42cq8dbw5bs	10	ORD-1764662570616-546	\N	PENDING	\N	2025-12-02 08:02:50.617	2025-12-02 08:02:50.617	cmio8tcne000014jqx4lpmg0x
cmioao1f00001c0ss9vlins98	cmio8dwpx0000f42cq8dbw5bs	10	ORD-1764662798123-171	\N	PENDING	\N	2025-12-02 08:06:38.125	2025-12-02 08:06:38.125	cmio8tcne000014jqx4lpmg0x
cmioaqdwf0001fawja3h09zh3	cmio8dwpx0000f42cq8dbw5bs	10	ORD-1764662907614-960	\N	PENDING	\N	2025-12-02 08:08:27.615	2025-12-02 08:08:27.615	cmio8tcne000014jqx4lpmg0x
cmioatizv0001prk5i5dleap9	cmio8dwpx0000f42cq8dbw5bs	10	ORD-1764663054186-663	\N	PENDING	\N	2025-12-02 08:10:54.187	2025-12-02 08:10:54.187	cmio8tcne000014jqx4lpmg0x
cmioaywwt00017m4wqbjsygkg	cmio8dwpx0000f42cq8dbw5bs	10	ORD-1764663305500-612	\N	PENDING	\N	2025-12-02 08:15:05.501	2025-12-02 08:15:05.501	cmio8tcne000014jqx4lpmg0x
cmiobc695000126235pkl9rvz	cmio8dwpx0000f42cq8dbw5bs	10.06	ORD-cmio8-1764663923764	PPAY_692ea273e8a4c	PENDING	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoAQMAAABAK/OWAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB/klEQVR4nO3Wy1YDMQwDUP//TwuoJTnDY0PMhqMUhk5yM4sqNq3KyPjXAz3q/YWPu57wYsEiekX76u0ft/3izdNF3+nOpuPpRVPnhuhljSGsiWof/Sd6smBANUURval9xdQEhn910Td6esxPL4roDX2OnlRAbENfVPSdhvsPb2azbl0T0bdaM5DzVpZIo3ly9JX2Z++zr90sCfCJ0St6Trzmq9yDOrPHg6Mvtf+76tTrwky8M3pFl7sN10rfXaYQ/G0m+laXyuFICXwK1IZmRC9o5aPNDuYsiOgd7a7+2Pn6y31nNUTfa0VCChYAoHqI3tPDwPMPRqOA4BqJ3tA9XS4CbXJNaEv0hu6T71/n8XiIePS9rqPh8Nz3PSvEq9ELuow5OYwPoohe0UpHNVA8/cW2M5USvaGVz/Sc50S3oaMcou/08eFziXsmm0fpRF/q13KpClQCUC7l5egFfZxzN/Vj/6xEr2jWAM9+/8EZh95E72gUc3BT57WO2oje0jz+UEjMRAoqkugdPSs9c5RDW2UWvaInFKjn4DuM6BU9n/sEA9VEUeITjv61xhx3xuOQ+I7ZRe9oXnXktbPwSEzpRF/r7j7OwK3IEFqN3tN17IIvfMR0n+glrdbjW709sove0KUqONdfP2XIcKLvNdxoykcfUyF9cTrRlzoj49+ONwpUF1djTn7XAAAAAElFTkSuQmCC	2025-12-02 08:25:24.138	2025-12-02 08:25:24.138	\N
cmiobldgr0001xolcnvau4rhw	cmio8dwpx0000f42cq8dbw5bs	10.07	ORD-cmio8-1764664353022	PPAY_692ea42132aa4	COMPLETED	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoAQMAAABAK/OWAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACA0lEQVR4nO3WwW7kMAwDUP3/T7NoRNKatnOp1UtBTzZI7GcflpHQqoyMfz3Qo/jv8/Y5WXgWp4he0TWnBZ+r3+qbi77SEBi5kHZcEtGLGsyG92drRf+Z5sOTC62eo1f16D6sif65KN71qujf6NNj3v0oojf0HMAMCFDv/3lE/07j9B9Sb9arayL6VkNYbjT/UjgOKfpa68Xffm+DSqKXvC36Tvd8jfkq96CTnUf0ne5QOGGvJ+gJ0Uta3Uab4MVTCC9/+0Tf6LPaX34/6hyoWEY5RN9qnETKEcGPvKJXtOcVUa+OiVkN0fe6K0KfP+dVG6joTY1egh56Dq07udJx0Rsa6j5nfYail+gdDZRfSttcGmpFSif6Up8PnivFeJSWffSaLn/9VVDv4U2ZRa9oReCInEW3nZdaiL7WxY4uDcVRCsYgekMrCy8RjPlTOtG3GgqF6y4BbmUbUveJvtXqP/r1CQTORulEX+pSOFyGo1F4yiV6SyuC3ueFURvRW5qfv4IpBaI6eCmT6GvdgRChAbTntHyHGH2ne1UfPuBVvGJEr+gTUm/lrnI2Sip6RZ84FFPvxKmOGllG32re9d/flyRD43HRG7pDUUCzLByeT4ve0ioGOt5UCF/Tib7VcKvB2IBxRvSO5h0115+rDBlO9L1mfykmwFRcISQ6NfpSZ2T82/EBHmRHJ5pvYzUAAAAASUVORK5CYII=	2025-12-02 08:32:33.387	2025-12-02 08:33:47.536	cmio8tcne000014jqx4lpmg0x
cmiobyakp0001m87wp7r43if5	cmio8dwpx0000f42cq8dbw5bs	10.07	ORD-cmio8-1764664955820	PPAY_692ea67c03710	COMPLETED	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoAQMAAABAK/OWAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACA0lEQVR4nO3WwW7kMAwDUP3/T7NoRNKatnOp1UtBTzZI7GcflpHQqoyMfz3Qo/jv8/Y5WXgWp4he0TWnBZ+r3+qbi77SEBi5kHZcEtGLGsyG92drRf+Z5sOTC62eo1f16D6sif65KN71qujf6NNj3v0oojf0HMAMCFDv/3lE/07j9B9Sb9arayL6VkNYbjT/UjgOKfpa68Xffm+DSqKXvC36Tvd8jfkq96CTnUf0ne5QOGGvJ+gJ0Uta3Uab4MVTCC9/+0Tf6LPaX34/6hyoWEY5RN9qnETKEcGPvKJXtOcVUa+OiVkN0fe6K0KfP+dVG6joTY1egh56Dq07udJx0Rsa6j5nfYail+gdDZRfSttcGmpFSif6Up8PnivFeJSWffSaLn/9VVDv4U2ZRa9oReCInEW3nZdaiL7WxY4uDcVRCsYgekMrCy8RjPlTOtG3GgqF6y4BbmUbUveJvtXqP/r1CQTORulEX+pSOFyGo1F4yiV6SyuC3ueFURvRW5qfv4IpBaI6eCmT6GvdgRChAbTntHyHGH2ne1UfPuBVvGJEr+gTUm/lrnI2Sip6RZ84FFPvxKmOGllG32re9d/flyRD43HRG7pDUUCzLByeT4ve0ioGOt5UCF/Tib7VcKvB2IBxRvSO5h0115+rDBlO9L1mfykmwFRcISQ6NfpSZ2T82/EBHmRHJ5pvYzUAAAAASUVORK5CYII=	2025-12-02 08:42:36.169	2025-12-02 08:44:53.252	cmio8tcne000014jqx4lpmg0x
\.


--
-- Data for Name: PricingPlan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PricingPlan" (id, name, price, days, "isRecommended", "createdAt", "updatedAt") FROM stdin;
cmio8tcne000014jqx4lpmg0x	ทดสอบ	10	30	f	2025-12-02 07:14:46.729	2025-12-02 07:14:46.729
\.


--
-- Data for Name: SystemConfig; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemConfig" (key, value) FROM stdin;
MAINTENANCE_MODE	false
ALLOW_REGISTER	true
ANNOUNCEMENT_ACTIVE	true
ANNOUNCEMENT_TEXT	ยินดีต้อนรับสู่ Savvy! เริ่มต้นวางแผนการเงินวันนี้
FREE_CATEGORY_LIMIT	5
SUPPORT_CONTACT	support@savvy.com
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transaction" (id, amount, date, note, "categoryId", "userId") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, image, "createdAt", "resetToken", "resetTokenExpiry", plan, "subscriptionId", "subscriptionEnds", role) FROM stdin;
cmio82x3o00004p1w2c5bvl1g	admin@admin.com	$2b$10$RztC.qEKiRaAdIdlnviS4ujLjb6jc1DIKPaquOcpat1MSuG8AAdmm	Super Admin	https://ui-avatars.com/api/?name=Admin+Savvy&background=6366f1&color=fff	2025-12-02 06:54:13.525	\N	\N	PRO	\N	\N	ADMIN
cmio8dwpx0000f42cq8dbw5bs	desnarong.sm@gmail.com	$2b$10$jW0CAy9.A4FUpejaYQHcAeDk4WdRQEX7kKRbM9O6fuLtetwXaVH0m	\N	\N	2025-12-02 07:02:46.245	\N	\N	PRO	\N	2026-01-01 08:44:53.25	USER
\.


--
-- Name: Budget Budget_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Budget"
    ADD CONSTRAINT "Budget_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: PricingPlan PricingPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PricingPlan"
    ADD CONSTRAINT "PricingPlan_pkey" PRIMARY KEY (id);


--
-- Name: SystemConfig SystemConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY (key);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Budget_month_year_categoryId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Budget_month_year_categoryId_userId_key" ON public."Budget" USING btree (month, year, "categoryId", "userId");


--
-- Name: Category_name_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_userId_key" ON public."Category" USING btree (name, "userId");


--
-- Name: Payment_ref1_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_ref1_key" ON public."Payment" USING btree (ref1);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_resetToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_resetToken_key" ON public."User" USING btree ("resetToken");


--
-- Name: Budget Budget_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Budget"
    ADD CONSTRAINT "Budget_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Budget Budget_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Budget"
    ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Category Category_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict fLrgLcNCQYdRy02UXysyRlAeBkUBVl7FAa8zz0DqJcUKZEvCQ25SXDpjVUgznOh

