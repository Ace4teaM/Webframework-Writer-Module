/*==============================================================*/
/* Nom de SGBD :  PostgreSQL 8 (WFW)                            */
/* Date de création :  03/04/2013 11:29:44                      */
/*==============================================================*/


drop table if exists WRITER_DOCUMENT  CASCADE;

drop table if exists WRITER_PUBLISHED  CASCADE;

/*==============================================================*/
/* Table : WRITER_DOCUMENT                                      */
/*==============================================================*/
create table WRITER_DOCUMENT (
   WRITER_DOCUMENT_ID   INT4                 not null,
   DOC_TITLE            VARCHAR(256)         not null,
   CONTENT_TYPE         VARCHAR(260)         not null,
   DOC_CONTENT          TEXT                 null,
   constraint PK_WRITER_DOCUMENT primary key (WRITER_DOCUMENT_ID)
);

/*==============================================================*/
/* Table : WRITER_PUBLISHED                                     */
/*==============================================================*/
create table WRITER_PUBLISHED (
   WRITER_PUBLISHED_ID  INT4                 not null,
   WRITER_DOCUMENT_ID   INT4                 not null,
   PARENT_PAGE_ID       VARCHAR(160)         null,
   PAGE_ID              VARCHAR(160)         not null,
   constraint PK_WRITER_PUBLISHED primary key (WRITER_PUBLISHED_ID)
);

alter table WRITER_PUBLISHED
   add constraint FK_WRITER_PUBLISH foreign key (WRITER_DOCUMENT_ID)
      references WRITER_DOCUMENT (WRITER_DOCUMENT_ID)
      on delete restrict on update restrict;

