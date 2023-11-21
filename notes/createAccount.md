CREATE TABLE Users(handle VARCHAR(20), username VARCHAR(30), email VARCHAR(100), password TEXT, bio VARCHAR(1000), following TEXT, followers TEXT, profilePicture VARCHAR(100), notes TEXT, announces TEXT, likes TEXT, publicKeyPem TEXT, privateKeyPem TEXT, emailVerification TEXT, token TEXT, lastVerificationEmailSent BIGSERIAL);

CREATE TABLE RemoteUsers(handle VARCHAR(50), username VARCHAR(100), bio TEXT, following TEXT, followers TEXT, profilePicture VARCHAR(300), notes TEXT, announces TEXT, likes TEXT, publicKeyPem TEXT, lastFetch BIGSERIAL, link VARCHAR(300), inbox VARCHAR(300), outbox VARCHAR(300));


CREATE TABLE POSTS

CREATE TABLE RemotePosts(author VARCHAR(50), content TEXT, link VARCHAR(300), date BIGSERIAL, likes BIGSERIAL, boosts BIGSERIAL, answers TEXT)