# Completion Criteria

For this experiment to be a success, it must satisfy the criteria described in
this document. The overarching goal is to 1) create a system for automatically
generating an API server from JSON specifications and 2) implement a sample app
on top of it with reasonably complex data structures.

## The Generator

(fill this in later)

## The Sample API

The API we are creating as a sample use case is a scheduling application for
multi-organization events such as conferences or tournaments. It contains three
main data types: User, Organization, and Event.

### User

This is the simplest structure with the simplest endpoints; it's also pretty
self-explanatory. It represents a user with email, username, and password hash.

### Organization

An organization is essentially a list of users-- its purpose here is to ensure
that the generator can handle endpoints which reference multiple collections,
such as /organization/:orgId/members.

### Event

An event is essentially a date and a list of organizations. Its purpose here is
to ensure that the generator can handle complex queries, such as finding all
events which take place within a specified time period.
