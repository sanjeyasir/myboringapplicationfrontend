<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
       

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            marginTop: "60px", // header height
            marginLeft: navOpen ? "250px" : "60px",
            transition: "margin-left 0.3s ease",
            padding: "20px",
            overflow: "auto",
          }}
        >
          {/* Metrics Cards */}
          <Grid container spacing={2} marginBottom={3}>
            {metrics.map((metric, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    borderLeft: `5px solid ${metric.color}`,
                    backgroundColor: "#f9f9f9",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      {metric.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color={metric.color}>
                      {metric.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Users Table */}
          <div
            style={{
              height: 500,
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              backgroundColor: "#fff",
            }}
          >
            <DataGrid
              rows={users}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              disableSelectionOnClick
            />
          </div>
        </main>
      </div>