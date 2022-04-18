CREATE SOURCE IF NOT EXISTS AGG_TRADE (
   eventTime integer,
   tradeId varchar,
   price varchar,
   quantity varchar,
   tradeTime integer,
   maker boolean
)
WITH (
   'connector'='kafka',
   'kafka.topic'='AggTrade',
   'kafka.bootstrap.servers'='localhost:9092',
   'kafka.scan.startup.mode'='latest',
   'kafka.time.offset'='140000000',
   'kafka.consumer.group'='test-group'
)
ROW FORMAT 'JSON';

CREATE MATERIALIZED VIEW trade_view
AS 
    SELECT * FROM AGG_TRADE;