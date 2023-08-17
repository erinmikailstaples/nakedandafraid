--goal: getting which contestant was in which episode
--there is a column "Participants" in the original episodes dataset that contains a comma-separated list of names; the names are sometimes just firstnames and sometimes full names

--in order to parse the field, we created a unnested version of the episodes table with each participant in its own row
with base as (
  select
    t1.id as episode_id
    ,unnest(string_split(t1.participants,',')) as participant
  from 
    t_episode t1
)

--then we compared each row to the list of contestants; we did firstname or fullname as a join condition
, matched as (
  select
    b.*
    ,t.id as contestant_id
    ,t.firstname
    ,t.lastname
  from
    base as b
  left join
    t_contestant as t on t.firstname = b.participant OR (t.firstname || ' ' || t.lastname) = b.participant
  order by
    b.episode_id
)

--this table creates a uuid for rows that are duplicates; i.e. there are multiple matches of contestants per episode
, uniques as (
  select
    *
    ,MD5(episode_id || participant) as uuid
  from
    matched
)

--this table filters the duplicates out from the dataset
, dupes as (
  select
    uuid,
    count(uuid) as uuid_co
  from
    uniques
  group by 
    uuid
  having 
    uuid_co > 1
  order by
    uuid_co desc
)

--we finally only want to see the duplicates in order to screen them manually
select
  u.*
from uniques as u
inner join dupes as d on d.uuid = u.uuid

--ideally we would manually correct the data by listing the participants full names for each episode by manually checking credits OR we find an alternative datasource