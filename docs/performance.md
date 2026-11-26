 QUERY PLAN                                                                         
-----------------------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=323.97..324.02 rows=20 width=77) (actual time=2.806..2.810 rows=20 loops=1)
   ->  Sort  (cost=323.97..332.70 rows=3493 width=77) (actual time=2.805..2.807 rows=20 loops=1)
         Sort Key: full_name, id
         Sort Method: top-N heapsort  Memory: 29kB
         ->  Bitmap Heap Scan on employees  (cost=51.36..231.02 rows=3493 width=77) (actual time=0.405..1.852 rows=3493 loops=1)
               Recheck Cond: (country = 'IN'::text)
               Heap Blocks: exact=136
               ->  Bitmap Index Scan on employees_country_job_title_idx  (cost=0.00..50.48 rows=3493 width=0) (actual time=0.375..0.375 rows=3493 loops=1)
                     Index Cond: (country = 'IN'::text)
 Planning Time: 0.781 ms
 Execution Time: 2.883 ms
(11 rows)




                                              QUERY PLAN                                               
-------------------------------------------------------------------------------------------------------
 Seq Scan on employees  (cost=0.00..261.00 rows=1 width=77) (actual time=0.202..9.050 rows=39 loops=1)
   Filter: (full_name ~~* '%sharma%'::text)
   Rows Removed by Filter: 9961
 Planning Time: 0.948 ms
 Execution Time: 9.175 ms
(5 rows)

            QUERY PLAN                                                                      
-----------------------------------------------------------------------------------------------------------------------------------------------------
 HashAggregate  (cost=248.48..248.71 rows=18 width=50) (actual time=2.086..2.092 rows=18 loops=1)
   Group Key: job_title
   Batches: 1  Memory Usage: 24kB
   ->  Bitmap Heap Scan on employees  (cost=51.36..231.02 rows=3493 width=22) (actual time=0.174..1.269 rows=3493 loops=1)
         Recheck Cond: (country = 'IN'::text)
         Heap Blocks: exact=136
         ->  Bitmap Index Scan on employees_country_job_title_idx  (cost=0.00..50.48 rows=3493 width=0) (actual time=0.152..0.153 rows=3493 loops=1)
               Index Cond: (country = 'IN'::text)
 Planning Time: 1.253 ms
 Execution Time: 2.194 ms
(10 rows)
